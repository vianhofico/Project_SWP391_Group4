import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { apiClient } from "../lib/axiosConfig";
import Footer from "@/components/footer";

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

            const res = await axios.get(
                "http://localhost:8080/api/purchased-courses",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            console.log("📦 Purchased courses list:", res.data);
            setPurchasedCourses(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("❌ Error fetching purchased courses:", err);
        }
    };

    const getSignedImageUrl = async (objectName) => {
        try {
            const res = await apiClient.post("file/public/signed-url/view", {
                objectName,
                type: "image",
                folder: "img",
            });
            return res.data.signedUrl;
        } catch (err) {
            console.error("Failed to get signed URL:", err);
            return null;
        }
    };

    const fetchAllCourses = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get("http://localhost:8080/api/home");
            const data = Array.isArray(res.data) ? res.data.slice(0, 3) : [];
            console.log("📚 Course data from API /home:", data);

            const signedCourses = await Promise.all(
                data.map(async (course) => {
                    const signedImageUrl = course.imageUrl
                        ? await getSignedImageUrl(course.imageUrl)
                        : null;
                    return { ...course, imageUrl: signedImageUrl };
                })
            );

            setCourseList(signedCourses);

            const discountResponses = await Promise.all(
                signedCourses.map((course) =>
                    axios
                        .get(
                            `http://localhost:8080/api/client/discounts/course/${course.courseId}`,
                            {
                                headers: { Authorization: `Bearer ${token}` },
                            }
                        )
                        .then((res) => {
                            console.log(
                                `🏷️ Discount for course ${course.courseId}:`,
                                res.data
                            );
                            return { courseId: course.courseId, discount: res.data };
                        })
                        .catch((err) => {
                            console.warn(
                                `⚠️ No discount for course ${course.courseId}`
                            );
                            return { courseId: course.courseId, discount: null };
                        })
                )
            );

            const discountData = {};
            discountResponses.forEach((item) => {
                if (item.discount?.discounted) {
                    discountData[item.courseId] = item.discount;
                }
            });

            setDiscountMap(discountData);
        } catch (err) {
            console.error("❌ Error fetching courses:", err);
        }
    };

    const handleAddToCart = async (id) => {
        setLoadingId(id);
        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "Please Login",
                text: "You need to login to perform this action",
                confirmButtonText: "Login Now",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login");
                }
            });
            return;
        }

        try {
            await axios.post(
                `http://localhost:8080/api/add-course-to-cart/${id}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const cartResponse = await axios.get("http://localhost:8080/api/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });

            localStorage.setItem(
                "cartItems",
                JSON.stringify(cartResponse.data || [])
            );
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (error) {
            console.error("❌ Cannot add course to cart:", error);
        } finally {
            setTimeout(() => setLoadingId(null), 500);
        }
    };

    const calculateDiscountedPrice = (price, discount) => {
        if (!discount) return price;
        const value = discount.discountValue;
        return discount.discountType === "PERCENT"
            ? Math.max(price * (1 - value / 100), 0)
            : Math.max(price - value, 0);
    };

    return (
        <div className="course-page">
            {/* Hero Section */}
            <section className="hero-section position-relative overflow-hidden">
                <div className="hero-background"></div>
                <div className="hero-overlay"></div>
                <div className="container position-relative">
                    <div className="row align-items-center min-vh-50">
                        <div className="col-lg-8 col-md-10 mx-auto text-center text-white">
                            <h1 className="display-4 fw-bold mb-4 animate-fade-up">
                                Transform Your Future with
                                <span className="text-gradient d-block">Premium Courses</span>
                            </h1>
                            <p className="lead mb-5 animate-fade-up-delay">
                                Discover world-class courses designed by industry experts.
                                Learn at your own pace with cutting-edge content and practical projects.
                            </p>
                            <div className="hero-stats d-flex justify-content-center gap-4 flex-wrap">
                                <div className="stat-item text-center">
                                    <div className="stat-number">50K+</div>
                                    <div className="stat-label">Students</div>
                                </div>
                                <div className="stat-item text-center">
                                    <div className="stat-number">200+</div>
                                    <div className="stat-label">Courses</div>
                                </div>
                                <div className="stat-item text-center">
                                    <div className="stat-number">98%</div>
                                    <div className="stat-label">Success Rate</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Courses Section */}
            <section className="courses-section py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="display-5 fw-bold text-primary mb-3">
                            <i className="bi bi-bookmark-star me-3"></i>
                            Featured Courses
                        </h2>
                        <p className="lead text-muted">
                            Handpicked courses to accelerate your learning journey
                        </p>
                        <div className="divider mx-auto"></div>
                    </div>

                    <div className="row g-4">
                        {courseList.map((course) => {
                            const discount = discountMap[course.courseId];
                            const finalPrice = calculateDiscountedPrice(course.price, discount);
                            const rating = Math.round(course.rating || 0);
                            const enrolled = course.enrollmentIds?.length || 0;

                            return (
                                <div
                                    key={course.courseId}
                                    className="col-lg-4 col-md-6 col-sm-12"
                                >
                                    <div className="course-card card h-100 border-0 rounded-4 overflow-hidden shadow-hover">
                                        {/* Discount Badge */}
                                        {discount && (
                                            <div className="position-absolute top-0 start-0 z-3">
                                                <span className="discount-badge badge bg-danger rounded-pill m-3 px-3 py-2">
                                                    <i className="bi bi-percent me-1"></i>
                                                    {discount.discountType === "PERCENT"
                                                        ? `${discount.discountValue}% OFF`
                                                        : `${discount.discountValue.toLocaleString()}VND OFF`}
                                                </span>
                                            </div>
                                        )}

                                        {/* Course Image */}
                                        <div
                                            className="course-image-wrapper position-relative"
                                            onClick={() => navigate(`/courses/${course.courseId}`)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <img
                                                src={
                                                    course.imageUrl ||
                                                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                                }
                                                alt={course.title}
                                                className="card-img-top course-image"
                                                onError={(e) => {
                                                    e.target.src =
                                                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                                                }}
                                            />
                                            <div className="course-overlay">
                                                <div className="overlay-content">
                                                    <i className="bi bi-play-circle fs-1"></i>
                                                    <span>Preview Course</span>
                                                </div>
                                            </div>
                                            <div className="enrollment-info">
                                                <i className="bi bi-people me-2"></i>
                                                {enrolled.toLocaleString()} enrolled
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="card-body d-flex flex-column p-4">
                                            <h5 className="course-title fw-bold text-dark mb-3">
                                                {course.title}
                                            </h5>

                                            <p className="course-description text-muted mb-3">
                                                {course.description ||
                                                    "Learn with modern frameworks and up-to-date content"}
                                            </p>

                                            {/* Rating */}
                                            <div className="rating-section d-flex align-items-center mb-4">
                                                <div className="stars me-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <i
                                                            key={i}
                                                            className={`bi ${
                                                                i < rating
                                                                    ? "bi-star-fill text-warning"
                                                                    : "bi-star text-muted"
                                                            } me-1`}
                                                        ></i>
                                                    ))}
                                                </div>
                                                <span className="rating-text text-muted">
                                                    {course.rating || 0} ({enrolled} reviews)
                                                </span>
                                            </div>

                                            {/* Price Section */}
                                            <div className="price-section mt-auto">
                                                {discount ? (
                                                    <div className="price-with-discount mb-3">
                                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                                            <div className="current-price">
                                                                <span className="price-current text-danger fw-bold fs-3">
                                                                    {finalPrice.toLocaleString()} VND
                                                                </span>
                                                                <span className="price-original text-muted text-decoration-line-through ms-2">
                                                                    {course.price.toLocaleString()} VND
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="savings-info text-success small fw-semibold">
                                                            <i className="bi bi-piggy-bank me-1"></i>
                                                            Save {(course.price - finalPrice).toLocaleString()} VND
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="price-regular mb-3">
                                                        <span className="price-current fw-bold fs-3 text-primary">
                                                            {course.price.toLocaleString()} VND
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Action Button */}
                                                {purchasedCourses.includes(course.courseId) ? (
                                                    <button className="btn btn-success btn-lg w-100 owned-btn" disabled>
                                                        <i className="bi bi-check-circle me-2"></i>
                                                        Already Owned
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn btn-primary btn-lg w-100 add-to-cart-btn"
                                                        disabled={loadingId === course.courseId}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleAddToCart(course.courseId);
                                                        }}
                                                    >
                                                        {loadingId === course.courseId ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                                Adding...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="bi bi-cart-plus me-2"></i>
                                                                Add to Cart
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* View All Button */}
                    <div className="text-center mt-5">
                        <button
                            className="btn btn-outline-primary btn-lg px-5 py-3 view-all-btn"
                            onClick={() => navigate("/feature-courses")}
                        >
                            <i className="bi bi-arrow-right-circle me-2"></i>
                            View All Courses
                            <i className="bi bi-arrow-right ms-2"></i>
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />

            <style jsx>{`
                .course-page {
                    padding-top: 80px; /* Account for fixed navbar */
                }

                /* Hero Section */
                .hero-section {
                    min-height: 70vh;
                    display: flex;
                    align-items: center;
                    position: relative;
                }

                .hero-background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, 
                        #667eea 0%, 
                        #764ba2 50%, 
                        #f093fb 100%);
                    z-index: 1;
                }

                .hero-background::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%);
                    z-index: 2;
                }

                .hero-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.2);
                    z-index: 3;
                }

                .text-gradient {
                    background: linear-gradient(45deg, #fff, #f093fb);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-stats {
                    margin-top: 2rem;
                }

                .stat-item {
                    padding: 0 1rem;
                }

                .stat-number {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #fff;
                }

                .stat-label {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.8);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .animate-fade-up {
                    animation: fadeUp 1s ease-out;
                }

                .animate-fade-up-delay {
                    animation: fadeUp 1s ease-out 0.3s both;
                }

                @keyframes fadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Courses Section */
                .courses-section {
                    background: #f8f9fa;
                }

                .divider {
                    width: 80px;
                    height: 4px;
                    background: linear-gradient(45deg, #667eea, #764ba2);
                    border-radius: 2px;
                    margin-top: 1rem;
                }

                .course-card {
                    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    background: #fff;
                }

                .course-card:hover {
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                }

                .course-image-wrapper {
                    position: relative;
                    overflow: hidden;
                    height: 220px;
                }

                .course-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.4s ease;
                }

                .course-card:hover .course-image {
                    transform: scale(1.1);
                }

                .course-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    z-index: 2;
                }

                .course-card:hover .course-overlay {
                    opacity: 1;
                }

                .overlay-content {
                    text-align: center;
                    color: white;
                }

                .overlay-content i {
                    display: block;
                    margin-bottom: 0.5rem;
                }

                .enrollment-info {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 0.5rem 1rem;
                    font-size: 0.85rem;
                    z-index: 3;
                }

                .discount-badge {
                    font-size: 0.75rem;
                    font-weight: 600;
                    box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
                }

                .course-title {
                    font-size: 1.25rem;
                    line-height: 1.4;
                    min-height: 3.5rem;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .course-description {
                    min-height: 4rem;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    line-height: 1.5;
                }

                .rating-section {
                    min-height: 2rem;
                }

                .rating-text {
                    font-size: 0.9rem;
                }

                .price-section {
                    border-top: 1px solid #eee;
                    padding-top: 1rem;
                }

                .price-current {
                    font-size: 1.5rem;
                }

                .price-original {
                    font-size: 1rem;
                }

                .savings-info {
                    background: rgba(25, 135, 84, 0.1);
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    display: inline-block;
                }

                .add-to-cart-btn {
                    background: linear-gradient(45deg, #667eea, #764ba2);
                    border: none;
                    transition: all 0.3s ease;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .add-to-cart-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
                    background: linear-gradient(45deg, #5a6fd8, #6a42a6);
                }

                .owned-btn {
                    background: linear-gradient(45deg, #28a745, #20c997);
                    border: none;
                }

                .view-all-btn {
                    border: 2px solid #007bff;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    transition: all 0.3s ease;
                }

                .view-all-btn:hover {
                    background: linear-gradient(45deg, #007bff, #6610f2);
                    border-color: transparent;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 123, 255, 0.4);
                }

                /* Footer */
                .footer {
                    background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
                }

                .footer-brand .text-gradient {
                    background: linear-gradient(45deg, #fff, #74b9ff);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .footer-links {
                    list-style: none;
                    padding: 0;
                }

                .footer-links li {
                    margin-bottom: 0.5rem;
                }

                .hero-background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: url("https://i.pinimg.com/736x/96/d1/cc/96d1cc416bfc7a2a0a16feb235f1defa.jpg");
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    z-index: 1;
                }


                .footer-links a {
                    color: #adb5bd;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }

                .footer-links a:hover {
                    color: #fff;
                }

                .social-link {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 255, 255, 0.1);
                    color: #fff;
                    border-radius: 50%;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .social-link:hover {
                    background: #fff;
                    color: #2c3e50;
                    transform: translateY(-3px);
                }

                .newsletter-form .form-control {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: #fff;
                }

                .newsletter-form .form-control::placeholder {
                    color: rgba(255, 255, 255, 0.7);
                }

                .newsletter-form .form-control:focus {
                    background: rgba(255, 255, 255, 0.15);
                    border-color: #007bff;
                    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
                    color: #fff;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .hero-section {
                        min-height: 60vh;
                        padding: 2rem 0;
                    }

                    .hero-stats {
                        margin-top: 1.5rem;
                    }

                    .stat-number {
                        font-size: 2rem;
                    }

                    .course-image-wrapper {
                        height: 200px;
                    }

                    .course-title {
                        font-size: 1.1rem;
                        min-height: auto;
                    }

                    .course-description {
                        min-height: auto;
                    }

                    .price-current {
                        font-size: 1.25rem;
                    }

                    .container {
                        padding: 0 15px;
                    }

                    .courses-section {
                        padding: 3rem 0;
                    }

                    .footer {
                        padding: 3rem 0;
                    }
                }

                @media (max-width: 576px) {
                    .hero-section {
                        min-height: 50vh;
                    }

                    .display-4 {
                        font-size: 2rem;
                    }

                    .hero-stats {
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .stat-item {
                        padding: 0;
                    }

                    .card-body {
                        padding: 1.5rem;
                    }

                    .view-all-btn {
                        padding: 0.75rem 2rem;
                        font-size: 0.9rem;
                    }

                    .footer .row > div {
                        margin-bottom: 2rem;
                    }
                }

                /* Scroll animations */
                @media (min-width: 768px) {
                    .course-card {
                        opacity: 0;
                        transform: translateY(20px);
                        animation: slideInUp 0.6s ease forwards;
                    }

                    .course-card:nth-child(1) { animation-delay: 0.1s; }
                    .course-card:nth-child(2) { animation-delay: 0.2s; }
                    .course-card:nth-child(3) { animation-delay: 0.3s; }
                }

                @keyframes slideInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Loading states */
                .course-card.loading {
                    opacity: 0.7;
                    pointer-events: none;
                }

                .spinner-border-sm {
                    width: 1rem;
                    height: 1rem;
                }

                /* Accessibility improvements */
                .course-card:focus-within {
                    outline: 2px solid #007bff;
                    outline-offset: 2px;
                }

                .btn:focus {
                    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
                }

                /* Dark mode support */
                @media (prefers-color-scheme: dark) {
                    .courses-section {
                        background: #1a1a1a;
                    }

                    .course-card {
                        background: #2d2d2d;
                        border-color: rgba(255, 255, 255, 0.1);
                    }

                    .course-title,
                    .text-dark {
                        color: #fff !important;
                    }

                    .text-muted {
                        color: #adb5bd !important;
                    }
                }
            `}</style>
        </div>
    );
};