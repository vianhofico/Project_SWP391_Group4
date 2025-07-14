import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import Swal from 'sweetalert2';

export const Course = () => {
    const [courseList, setCourseList] = useState([]);
    const [discountMap, setDiscountMap] = useState({});
    const [loadingId, setLoadingId] = useState(null);
    const [purchasedCourses, setPurchasedCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllCourses();
        fetchPurchasedCourses();
    }, []);

    const fetchPurchasedCourses = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await axios.get("http://localhost:8080/api/purchased-courses", {
                headers: {Authorization: `Bearer ${token}`}
            });
            setPurchasedCourses(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách khóa học đã mua:", err);
        }
    };

    const fetchAllCourses = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:8080/api/home`);
            const data = Array.isArray(res.data) ? res.data.slice(0, 3) : [];
            // const data = Array.isArray(res.data) ? res.data : [];
            setCourseList(data);

            const discountResponses = await Promise.all(
                data.map(course =>
                    axios
                        .get(`http://localhost:8080/api/client/discounts/course/${course.courseId}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                        .then(res => ({courseId: course.courseId, discount: res.data}))
                        .catch(() => ({courseId: course.courseId, discount: null}))
                )
            );

            const discountData = {};
            discountResponses.forEach(item => {
                if (item.discount?.discounted) {
                    discountData[item.courseId] = item.discount;
                }
            });

            setDiscountMap(discountData);
        } catch (err) {
            console.error("Failed to fetch courses:", err);
        }
    };

    const handleAddToCart = async (id) => {
        setLoadingId(id);
        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "Vui lòng đăng nhập",
                text: "Bạn cần đăng nhập để thực hiện chức năng này",
                confirmButtonText: "Đăng nhập ngay"
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login");
                }
            });
            return;
        }
        try {
            await axios.post(`http://localhost:8080/api/add-course-to-cart/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const cartResponse = await axios.get("http://localhost:8080/api/cart", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            localStorage.setItem("cartItems", JSON.stringify(cartResponse.data || []));
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (error) {
            console.error("cannot add course to cart");
        } finally {
            setTimeout(() => {
                setLoadingId(null);
            }, 500);
        }
    };

    const calculateDiscountedPrice = (price, discount) => {
        if (!discount) return price;
        const value = discount.discountValue;
        return discount.discountType === 'PERCENT'
            ? Math.max(price * (1 - value / 100), 0)
            : Math.max(price - value, 0);
    };

    return (
        <div className="container mt-4" style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '10px'
        }}>
            <h2 className="mb-4 text-center" style={{ color: '#2c3e50' }}>Khóa Học Nổi Bật</h2>

            <div className="row">
                {courseList.map(course => {
                    const discount = discountMap[course.courseId];
                    const finalPrice = calculateDiscountedPrice(course.price, discount);

                    return (
                        <div className="col-md-4 mb-4" key={course.courseId}>
                            <div
                                className="card h-100 shadow-sm"
                                style={{
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e0e0e0',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    ':hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                    }
                                }}
                            >
                                <div className="card-header bg-white">
                                    <img
                                        src={encodeURI(course.imageUrl)}
                                        alt={course.title}
                                        style={{
                                            width: "100%",
                                            height: "180px",
                                            objectFit: "contain",
                                            borderBottom: '1px solid #eee'
                                        }}
                                    />
                                    <h5 className="mt-3 mb-0 text-center" style={{ color: '#2c3e50' }}>{course.title}</h5>
                                </div>
                                <div className="card-body">
                                    <p className="card-text" style={{ color: '#34495e' }}>{course.description}</p>
                                    <p className="text-muted small mb-2">
                                        {course.description || "Học với framework hiện đại"}
                                    </p>

                                    {discount ? (
                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                            <span className="text-danger fw-bold fs-5" style={{ color: '#e74c3c' }}>
                                                {finalPrice.toLocaleString()} ₫
                                            </span>
                                                <span className="text-muted text-decoration-line-through">
                                                {course.price.toLocaleString()} ₫
                                            </span>
                                            </div>
                                            <div className="text-success small">
                                                {discount.discountType === 'PERCENT'
                                                    ? `Giảm ${discount.discountValue}%`
                                                    : `Giảm ${discount.discountValue.toLocaleString()} ₫`}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mb-3">
                                        <span className="fw-bold fs-5" style={{ color: '#2c3e50' }}>
                                            {course.price.toLocaleString()} ₫
                                        </span>
                                        </div>
                                    )}

                                    <div className="d-flex justify-content-between small text-muted mb-3">
                                        <span>✗ {Math.floor(Math.random() * 1000) + 500}</span>
                                        <span>✖ 99% ({Math.floor(Math.random() * 300) + 100})</span>
                                    </div>
                                </div>
                                <div className="card-footer bg-white border-0">
                                    {purchasedCourses.includes(course.courseId) ? (
                                        <button className="btn btn-success w-100" disabled>
                                            Đã mua
                                        </button>
                                    ) : (
                                        <button
                                            className="btn w-100"
                                            style={{
                                                backgroundColor: '#3498db',
                                                color: 'white',
                                                border: 'none',
                                                ':hover': {
                                                    backgroundColor: '#2980b9'
                                                }
                                            }}
                                            onClick={() => handleAddToCart(course.courseId)}
                                            disabled={loadingId === course.courseId}
                                        >
                                            {loadingId === course.courseId ? (
                                                <span>Đang thêm...</span>
                                            ) : (
                                                <span>Thêm vào giỏ hàng</span>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>



            <div className="text-center mt-4">
                <button className="btn btn-outline-secondary" onClick ={() => navigate("/courses")}>
                    Xem Tất Cả
                </button>
            </div>
        </div>
    );
};