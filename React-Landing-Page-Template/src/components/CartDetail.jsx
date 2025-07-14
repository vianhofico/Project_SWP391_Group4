import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Swal from 'sweetalert2';

const CartDetail = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const [discountMap, setDiscountMap] = useState({});
    const [totalDiscount, setTotalDiscount] = useState(0);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    // Hàm định dạng ngày thành dd/mm/yyyy
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        let total = 0;
        let discountAmount = 0;

        cartItems.forEach((item) => {
            if (selectedItems.includes(item.cartItemId)) {
                const course = item.course;
                const discount = discountMap[course.courseId];
                const original = course.price;
                const final = calculateDiscountedPrice(original, discount);
                total += final;
                discountAmount += original - final;
            }
        });

        setTotalPrice(total);
        setTotalDiscount(discountAmount);
    }, [cartItems, selectedItems, discountMap]);

    const fetchCart = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const items = response.data;
            setCartItems(Array.isArray(items) ? items : []);
            setSelectedItems(items.map(item => item.cartItemId));
            localStorage.setItem("cartItems", JSON.stringify(items));
            window.dispatchEvent(new Event("cartUpdated"));

            const discountResponses = await Promise.all(
                items.map(item =>
                    axios
                        .get(`http://localhost:8080/api/client/discounts/course/${item.course.courseId}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                        .then(res => ({courseId: item.course.courseId, discount: res.data}))
                        .catch(() => ({courseId: item.course.courseId, discount: null}))
                )
            );

            const map = {};
            discountResponses.forEach(item => {
                if (item.discount?.discounted) {
                    map[item.courseId] = item.discount;
                }
            });
            setDiscountMap(map);
        } catch (error) {
            console.error("Lỗi khi lấy giỏ hàng:", error);
            setCartItems([]);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/delete-cart-course/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            await fetchCart();
        } catch (error) {
            console.error("Lỗi khi xoá sản phẩm:", error);
        }
    };

    const handleDeleteAll = async () => {
        const confirm = await Swal.fire({
            icon: 'warning',
            title: 'Xác nhận xoá toàn bộ',
            text: 'Bạn có chắc muốn xoá tất cả sản phẩm trong giỏ hàng?',
            showCancelButton: true,
            confirmButtonText: 'Xoá hết',
            cancelButtonText: 'Huỷ'
        });

        if (confirm.isConfirmed) {
            try {
                await Promise.all(
                    cartItems.map(item =>
                        axios.delete(`http://localhost:8080/api/delete-cart-course/${item.cartItemId}`, {
                            headers: {Authorization: `Bearer ${token}`}
                        })
                    )
                );
                await fetchCart();
            } catch (error) {
                console.error("Lỗi khi xoá tất cả:", error);
            }
        }
    };

    const handleCheckboxChange = (e, id) => {
        if (e.target.checked) {
            setSelectedItems((prev) => [...prev, id]);
        } else {
            setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
        }
    };

    const calculateDiscountedPrice = (price, discount) => {
        if (!discount) return price;
        return discount.discountType === 'PERCENT'
            ? Math.max(price * (1 - discount.discountValue / 100), 0)
            : Math.max(price - discount.discountValue, 0);
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Chưa chọn sản phẩm',
                text: 'Vui lòng chọn ít nhất một sản phẩm để thanh toán.',
                confirmButtonText: 'OK'
            });
            return;
        }

        const selectedCartItems = cartItems.filter(item =>
            selectedItems.includes(item.cartItemId)
        ).map(item => {
            const course = item.course;
            const discount = discountMap[course.courseId];
            return {
                id: item.cartItemId,
                course,
                price: calculateDiscountedPrice(course.price, discount)
            };
        });

        navigate("/confirm-checkout", {state: {checkoutData: selectedCartItems}});
    };

    const selectAll = () => {
        setSelectedItems(cartItems.map(item => item.cartItemId));
    };

    const deselectAll = () => {
        setSelectedItems([]);
    };

    return (
        <div style={{paddingTop: '100px'}}>
            {cartItems.length === 0 ? (
                <div className="d-flex flex-column align-items-center justify-content-center" style={{ padding: "100px 0" }}>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
                        alt="Empty Cart"
                        style={{ width: "120px", marginBottom: "20px" }}
                    />
                    <h4 className="text-secondary mb-2">Giỏ hàng của bạn đang trống</h4>
                    <p className="text-muted mb-4">Khám phá thêm các khoá học để bắt đầu hành trình học tập của bạn!</p>
                    <button className="btn btn-primary" onClick={() => navigate("/")}>
                        Quay lại cửa hàng
                    </button>
                </div>
            ) : (
                <div className="container py-5">
                    <h2 className="mb-4">Giỏ hàng</h2>
                    <div className="d-flex align-items-center gap-3 mb-3">
                        <span className="fw-bold text-success fs-6 m-0">
                            Đã chọn {selectedItems.length}/{cartItems.length} khoá học
                        </span>
                        <button className="btn btn-sm btn-outline-danger" onClick={handleDeleteAll}>
                            Xoá tất cả sản phẩm
                        </button>
                    </div>


                    <div className="row">
                        <div className="col-md-8">
                            {cartItems.map((item) => {
                                const course = item.course;
                                const discount = discountMap[course.courseId];
                                const finalPrice = calculateDiscountedPrice(course.price, discount);

                                return (
                                    <div className="d-flex align-items-center border-bottom py-3" key={item.cartItemId}>
                                        <div className="me-3">
                                            <img
                                                src={encodeURI(course.imageUrl)}
                                                alt="Ảnh khoá học"
                                                className="img-thumbnail"
                                                style={{width: '80px', height: '80px', objectFit: 'cover'}}
                                            />
                                        </div>

                                        <div className="flex-grow-1">
                                            <h5 className="mb-1">{course.title}</h5>
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(item.cartItemId)}
                                                onChange={(e) => handleCheckboxChange(e, item.cartItemId)}
                                                className="form-check-input me-1"
                                            />
                                            <small className="fs-5">Chọn để mua</small>
                                        </div>

                                        <div className="text-end">
                                            {discount ? (
                                                <>
                                                    <div className="text-danger fw-bold fs-5">
                                                        {finalPrice.toLocaleString()} đ
                                                    </div>
                                                    <div className="text-muted text-decoration-line-through fs-5">
                                                        {course.price.toLocaleString()} đ
                                                    </div>
                                                    <div className="text-success fs-6">
                                                        {discount.discountType === 'PERCENT'
                                                            ? `Giảm ${discount.discountValue}%`
                                                            : `Giảm ${discount.discountValue.toLocaleString()} đ`}
                                                    </div>
                                                    {discount.endDate && (
                                                        <div className="text-warning fs-6">
                                                            Ưu đãi
                                                            đến: {formatDate(discount.endDate)}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="fs-5">{course.price.toLocaleString()} đ</div>
                                            )}
                                            <button
                                                className="btn btn-outline-danger btn-sm mt-2"
                                                onClick={() => handleDelete(item.cartItemId)}
                                            >
                                                Xoá
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="col-md-4">
                            <div className="border p-3 rounded">
                                <h5 className="mb-3">Tóm tắt</h5>
                                <ul className="list-unstyled">
                                    <li className="d-flex justify-content-between">
                                        <span>Tạm tính:</span>
                                        <strong>{totalPrice.toLocaleString()} đ</strong>
                                    </li>
                                    <hr/>
                                    <li className="d-flex justify-content-between fs-5">
                                        <strong>Tổng cộng:</strong>
                                        <strong>{totalPrice.toLocaleString()} đ</strong>
                                    </li>
                                </ul>
                                <p className="text-success text-end">
                                    Bạn đã tiết kiệm được {totalDiscount.toLocaleString()} đ
                                </p>
                                <button className="btn btn-success w-100 mt-3" onClick={handleCheckout}>
                                    Tiến hành thanh toán
                                </button>
                                <button className="btn btn-outline-primary w-100 mt-2" onClick={() => navigate("/")}>
                                    Quay lại cửa hàng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartDetail;
