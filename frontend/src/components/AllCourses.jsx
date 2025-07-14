import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export const AllCourses = () => {
    const [courses, setCourses] = useState([]);
    const [purchasedCourses, setPurchasedCourses] = useState([]);
    const [loadingId, setLoadingId] = useState(null);
    const [selectedSkills, setSelectedSkills] = useState([
        "Frontend ReactJS",
        "Backend Node.JS",
        "Backend Java",
    ]);

    const skills = [
        "Frontend ReactJS",
        "Backend Node.JS",
        "Backend Java",
    ];

    useEffect(() => {
        fetchCourses();
        fetchPurchasedCourses();
    }, []);

    const assignCategory = (title) => {
        const lower = title.toLowerCase();
        if (lower.includes("node") || lower.includes("nestjs")) return "Backend Node.JS";
        if (lower.includes("spring") || lower.includes("java")) return "Backend Java";
        if (lower.includes("react") || lower.includes("redux")) return "Frontend ReactJS";
        return "Khác";
    };

    const fetchCourses = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/home");
            const data = Array.isArray(res.data) ? res.data : [];
            // Gán category thủ công
            const withCategory = data.map(course => ({
                ...course,
                category: assignCategory(course.title || "")
            }));
            setCourses(withCategory);
        } catch (err) {
            console.error("Failed to fetch courses:", err);
        }
    };

    const fetchPurchasedCourses = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await axios.get("http://localhost:8080/api/purchased-courses", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPurchasedCourses(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách khóa học đã mua:", err);
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
                confirmButtonText: "Đăng nhập ngay",
            });
            return;
        }

        try {
            await axios.post(`http://localhost:8080/api/add-course-to-cart/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const cartRes = await axios.get("http://localhost:8080/api/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });

            localStorage.setItem("cartItems", JSON.stringify(cartRes.data || []));
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (error) {
            console.error("Không thể thêm khóa học vào giỏ hàng:", error);
        } finally {
            setTimeout(() => setLoadingId(null), 500);
        }
    };

    const handleToggleSkill = (skill) => {
        setSelectedSkills(prev =>
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        );
    };

    const categorizedCourses = courses.reduce((acc, course) => {
        const category = course.category || "Khác";
        if (!acc[category]) acc[category] = [];
        acc[category].push(course);
        return acc;
    }, {});

    const renderCourseCard = (course) => {
        const isPurchased = purchasedCourses.includes(course.courseId);

        return (
            <div
                key={course.courseId}
                className="card"
                style={{ width: "18rem", minWidth: "250px" }}
            >
                <img
                    src={course.imageUrl}
                    className="card-img-top"
                    alt={course.title}
                    style={{ height: "150px", objectFit: "cover" }}
                />
                <div className="card-body">
                    <h6 className="card-title text-truncate" title={course.title}>
                        {course.title}
                    </h6>
                    <p className="text-danger fw-bold">
                        {course.price.toLocaleString()} ₫
                    </p>
                    <a href="#" className="text-primary small">
                        → Xem chi tiết
                    </a>
                    <div className="mt-3">
                        {isPurchased ? (
                            <button className="btn btn-success w-100" disabled>
                                Đã mua
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary w-100"
                                onClick={() => handleAddToCart(course.courseId)}
                                disabled={loadingId === course.courseId}
                            >
                                {loadingId === course.courseId ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container-fluid" style={{ paddingTop: "80px" }}>
            <div className="row">
                {/* Bộ lọc kỹ năng */}
                <div className="col-md-3">
                    <div className="border rounded p-3 mb-4">
                        <h6 className="fw-bold mb-3">Phân loại kỹ năng:</h6>
                        <div className="d-flex flex-column gap-2">
                            {skills.map((skill) => (
                                <div
                                    key={skill}
                                    className="form-check d-flex align-items-center gap-2"
                                >
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={selectedSkills.includes(skill)}
                                        onChange={() => handleToggleSkill(skill)}
                                    />
                                    <label className="form-check-label mb-0">{skill}</label>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-outline-primary btn-sm mt-3 w-100">
                            Gợi Ý Khóa Học
                        </button>
                    </div>
                </div>

                {/* Danh sách khóa học */}
                <div className="col-md-9">
                    {Object.entries(categorizedCourses).map(([category, list]) => {
                        if (!selectedSkills.includes(category)) return null;
                        return (
                            <div key={category} className="mb-5">
                                <span className="badge bg-light border text-primary mb-3">
                                    Lộ Trình {category}
                                </span>
                                <div className="d-flex flex-wrap gap-3">
                                    {list.map((course) => renderCourseCard(course))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
