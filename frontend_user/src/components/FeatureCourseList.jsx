import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { publicApiClient } from "../lib/publicApiClient";
import { apiClient } from "../lib/axiosConfig"; // dùng riêng cho signed URL
import axios from "axios";

export default function FeatureCourseList() {
    const [searchParams, setSearchParams] = useSearchParams();

    const topicId = searchParams.get("topic_id") || "0";
    const sortField = searchParams.get("field") || "";
    const sortOrder = searchParams.get("order") || "asc";
    const page = parseInt(searchParams.get("page") || "0", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);
    const search = searchParams.get("search") || "";

    const [topics, setTopics] = useState([]);
    const [courses, setCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState(search);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [discountMap, setDiscountMap] = useState({});
    const [purchasedCourses, setPurchasedCourses] = useState([]);

    const getSignedImageUrl = async (objectName) => {
        try {
            const res = await apiClient.post("/file/public/signed-url/view", {
                objectName,
                type: "img",
                folder: "img",
            });
            return res.data.signedUrl;
        } catch (err) {
            console.error("Failed to get signed URL:", err);
            return null;
        }
    };

    const fetchTopics = async () => {
        try {
            const res = await publicApiClient.get("/public/user/topics");
            setTopics(res.data || []);
        } catch (err) {
            console.error("Failed to load topics", err);
        }
    };

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
            console.log("📦 Danh sách khóa học đã mua:", res.data);
            setPurchasedCourses(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("❌ Lỗi khi lấy danh sách khóa học đã mua:", err);
        }
    };

    const fetchDiscounts = async (courseIds) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return {};

            const discountResponses = await Promise.all(
                courseIds.map((courseId) =>
                    axios
                        .get(
                            `http://localhost:8080/api/client/discounts/course/${courseId}`,
                            {
                                headers: { Authorization: `Bearer ${token}` },
                            }
                        )
                        .then((res) => {
                            console.log(`🏷️ Discount cho course ${courseId}:`, res.data);
                            return { courseId, discount: res.data };
                        })
                        .catch((err) => {
                            console.warn(`⚠️ Không có discount cho course ${courseId}`);
                            return { courseId, discount: null };
                        })
                )
            );

            const discountData = {};
            discountResponses.forEach((item) => {
                if (item.discount?.discounted) {
                    discountData[item.courseId] = item.discount;
                }
            });

            return discountData;
        } catch (err) {
            console.error("❌ Lỗi khi fetch discounts:", err);
            return {};
        }
    };

    const calculateDiscountedPrice = (price, discount) => {
        if (!discount) return price;
        const value = discount.discountValue;
        return discount.discountType === "PERCENT"
            ? Math.max(price * (1 - value / 100), 0)
            : Math.max(price - value, 0);
    };

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                size,
                status: "ACTIVE", // Luôn giữ status là ACTIVE
            };

            // Chỉ thêm search nếu có giá trị
            if (search && search.trim()) {
                params.search = search.trim();
            }

            // Chỉ thêm sort nếu có cả field và order
            if (sortField && sortOrder) {
                params.sort = `${sortField},${sortOrder}`;
            }

            console.log("🔍 Fetch params:", params); // Debug log

            const res = await publicApiClient.get(
                `public/user/courses/topics/${topicId}/courses`,
                { params }
            );

            const content = res.data.content || [];
            setTotalPages(res.data.totalPages || 0);
            setTotalItems(res.data.totalElements || 0);

            const signedCourses = await Promise.all(
                content.map(async (course) => {
                    const signedUrl = course.imageUrl
                        ? await getSignedImageUrl(course.imageUrl)
                        : null;
                    return { ...course, signedImageUrl: signedUrl };
                })
            );

            setCourses(signedCourses);

            // Fetch discounts for all courses
            const courseIds = signedCourses.map((course) => course.courseId);
            const discounts = await fetchDiscounts(courseIds);
            setDiscountMap(discounts);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateSearchParams = (newParams) => {
        const params = new URLSearchParams(searchParams);
        Object.entries(newParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.set(key, value.toString());
            } else {
                params.delete(key); // Xóa param nếu giá trị rỗng
            }
        });
        setSearchParams(params);
        console.log("🔄 Updated search params:", Object.fromEntries(params)); // Debug log
    };

    const handleTopicChange = (e) => {
        const selectedTopicId = e.target.value;
        updateSearchParams({ topic_id: selectedTopicId, page: 0 });
        console.log("🏷️ Topic changed:", selectedTopicId); // Debug log
    };

    useEffect(() => {
        fetchTopics();
        fetchPurchasedCourses();
    }, []);

    useEffect(() => {
        console.log("🔄 useEffect triggered with:", {
            topicId,
            sortField,
            sortOrder,
            page,
            size,
            search,
        });
        fetchCourses();
    }, [topicId, sortField, sortOrder, page, size, search]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    return (
        <div
            className="container-fluid py-4"
            style={{ maxWidth: "1400px", marginTop: "80px" }}
        >
            {/* Filter Bar */}
            <div
                className="row justify-content-center mb-4 g-3"
                style={{
                    display: "flex !important",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    marginBottom: "2rem",
                    gap: "1rem",
                    padding: "20px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "15px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                }}
            >
                <div className="col-md-3 col-sm-6" style={{ minWidth: "200px" }}>
                    <input
                        type="text"
                        placeholder="🔍 Search courses..."
                        value={searchQuery}
                        onChange={(e) => {
                            const newQuery = e.target.value;
                            setSearchQuery(newQuery);
                            updateSearchParams({ search: newQuery, page: 0 });
                            console.log("🔍 Search query changed:", newQuery); // Debug log
                        }}
                        className="form-control shadow-sm"
                        style={{
                            fontSize: "14px",
                            padding: "10px 16px",
                            border: "2px solid #e9ecef",
                            borderRadius: "10px",
                            display: "block",
                            width: "100%",
                            transition: "all 0.3s ease",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                        onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                    />
                </div>

                <div className="col-md-2 col-sm-6" style={{ minWidth: "160px" }}>
                    <select
                        value={sortField}
                        onChange={(e) => {
                            const newField = e.target.value;
                            updateSearchParams({ field: newField, page: 0 });
                            console.log("🔄 Sort field changed:", newField); // Debug log
                        }}
                        className="form-select shadow-sm"
                        style={{
                            fontSize: "14px",
                            padding: "10px 16px",
                            border: "2px solid #e9ecef",
                            borderRadius: "10px",
                            display: "block",
                            width: "100%",
                            backgroundColor: "white",
                            transition: "all 0.3s ease",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#28a745")}
                        onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                    >
                        <option value="">📊 Sort by</option>
                        <option value="price">💰 Price</option>
                        <option value="title">🔠 Name</option>
                        <option value="rating">⭐ Rating</option>
                        <option value="popular">🔥 Popular</option>
                        <option value="updateAt">🆕 Newest</option>
                    </select>
                </div>

                <div className="col-md-2 col-sm-6" style={{ minWidth: "160px" }}>
                    <select
                        value={sortOrder}
                        onChange={(e) => {
                            const newOrder = e.target.value;
                            updateSearchParams({ order: newOrder, page: 0 });
                            console.log("🔄 Sort order changed:", newOrder); // Debug log
                        }}
                        className="form-select shadow-sm"
                        style={{
                            fontSize: "14px",
                            padding: "10px 16px",
                            border: "2px solid #e9ecef",
                            borderRadius: "10px",
                            display: "block",
                            width: "100%",
                            backgroundColor: "white",
                            transition: "all 0.3s ease",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#ffc107")}
                        onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                    >
                        <option value="">↕️ Order</option>
                        <option value="asc">⬆️ Ascending</option>
                        <option value="desc">⬇️ Descending</option>
                    </select>
                </div>

                <div className="col-md-3 col-sm-6" style={{ minWidth: "200px" }}>
                    <select
                        value={topicId}
                        onChange={handleTopicChange}
                        className="form-select shadow-sm"
                        style={{
                            fontSize: "14px",
                            padding: "10px 16px",
                            border: "2px solid #e9ecef",
                            borderRadius: "10px",
                            display: "block",
                            width: "100%",
                            backgroundColor: "white",
                            transition: "all 0.3s ease",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#6f42c1")}
                        onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                    >
                        <option value="0">📚 All Topics</option>
                        {topics.map((topic) => (
                            <option key={topic.topicid} value={topic.topicid}>
                                {topic.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Total */}
            <div className="text-center mb-4">
                <p className="text-muted mb-0">
                    🎓 Found <strong className="text-primary">{totalItems}</strong>{" "}
                    courses
                </p>
            </div>

            {/* Course List */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-primary mt-2">Loading courses...</p>
                </div>
            ) : courses.length === 0 ? (
                <div className="text-center py-5">
                    <p className="text-muted">No courses found.</p>
                </div>
            ) : (
                <>
                    <div className="row g-4">
                        {courses.map((course) => {
                            const discount = discountMap[course.courseId];
                            const finalPrice = calculateDiscountedPrice(
                                course.price,
                                discount
                            );
                            const rating = Math.round(course.rating || 0);
                            const enrolled = Array.isArray(course.enrollmentIds)
                                ? course.enrollmentIds.length
                                : 0;

                            return (
                                <div
                                    key={course.courseId}
                                    className="col-lg-4 col-md-6 col-sm-12"
                                >
                                    <Link
                                        to={`/courses/${course.courseId}`}
                                        className="text-decoration-none"
                                    >
                                        <div className="card h-100 shadow-sm border-0 rounded-4 course-card position-relative">
                                            {/* Discount Badge */}
                                            {discount && (
                                                <div
                                                    className="position-absolute top-0 start-0"
                                                    style={{ zIndex: 3 }}
                                                >
                          <span className="badge bg-danger rounded-pill m-2 px-3 py-2">
                            <i className="bi bi-percent me-1"></i>
                              {discount.discountType === "PERCENT"
                                  ? `${discount.discountValue}% OFF`
                                  : `${discount.discountValue.toLocaleString()}₫ OFF`}
                          </span>
                                                </div>
                                            )}

                                            <div className="card-body text-center p-4">
                                                {course.signedImageUrl ? (
                                                    <div className="course-image-container mb-3 mx-auto position-relative overflow-hidden rounded-4 shadow">
                                                        <img
                                                            src={course.signedImageUrl}
                                                            alt={course.title}
                                                            className="course-image img-fluid"
                                                            style={{
                                                                width: "200px",
                                                                height: "200px",
                                                                objectFit: "cover",
                                                                transition: "transform 0.3s ease",
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="bg-light rounded-4 shadow-sm mb-3 mx-auto"
                                                        style={{
                                                            width: "200px",
                                                            height: "200px",
                                                        }}
                                                    />
                                                )}

                                                <h5
                                                    className="card-title text-dark fw-bold lh-base"
                                                    style={{
                                                        fontSize: "1.1rem",
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    {course.title}
                                                </h5>

                                                {/* Rating */}
                                                <div className="d-flex align-items-center justify-content-center mb-3">
                                                    <div className="me-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <i
                                                                key={i}
                                                                className={`bi ${
                                                                    i < rating
                                                                        ? "bi-star-fill text-warning"
                                                                        : "bi-star text-muted"
                                                                } me-1`}
                                                                style={{ fontSize: "0.9rem" }}
                                                            ></i>
                                                        ))}
                                                    </div>
                                                    <span className="text-muted small">
                            ({course.rating?.toFixed(1) || 0})
                          </span>
                                                </div>

                                                {/* Price Section */}
                                                {discount ? (
                                                    <div className="mb-3">
                                                        <div className="d-flex align-items-center justify-content-center flex-wrap">
                              <span className="text-danger fw-bold fs-5 me-2">
                                💰 {finalPrice.toLocaleString()}₫
                              </span>
                                                            <span className="text-muted text-decoration-line-through small">
                                {course.price.toLocaleString()}₫
                              </span>
                                                        </div>
                                                        <div className="text-success small fw-semibold mt-1">
                                                            Tiết kiệm:{" "}
                                                            {(course.price - finalPrice).toLocaleString()}₫
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="card-text text-muted small mb-2">
                                                        💰 Price:{" "}
                                                        <span className="text-success fw-semibold">
                              {course.price?.toLocaleString() ?? "N/A"}₫
                            </span>
                                                    </p>
                                                )}

                                                <p className="card-text text-muted small mb-0">
                                                    👥 Learners:{" "}
                                                    <span className="fw-semibold">{enrolled}</span>
                                                </p>

                                                {/* Purchased Badge */}
                                                {purchasedCourses.includes(course.courseId) && (
                                                    <div className="mt-2">
                            <span className="badge bg-success">
                              <i className="bi bi-check-circle me-1"></i>
                              Đã sở hữu
                            </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-5 pt-4 border-top">
                        <div className="d-flex align-items-center mb-3 mb-md-0">
                            <button
                                onClick={() => updateSearchParams({ page: page - 1 })}
                                disabled={page <= 0}
                                className="btn btn-outline-secondary me-2 rounded-pill"
                            >
                                ⬅ Previous
                            </button>
                            <span className="px-3 py-2 text-muted fw-medium">
                Page {page + 1} / {totalPages}
              </span>
                            <button
                                onClick={() => updateSearchParams({ page: page + 1 })}
                                disabled={page >= totalPages - 1}
                                className="btn btn-outline-secondary ms-2 rounded-pill"
                            >
                                Next ➡
                            </button>
                        </div>

                        <div className="d-flex align-items-center">
                            <label
                                htmlFor="pageSize"
                                className="form-label text-muted me-2 mb-0"
                            >
                                Items per page:
                            </label>
                            <select
                                id="pageSize"
                                value={size}
                                onChange={(e) =>
                                    updateSearchParams({ size: e.target.value, page: 0 })
                                }
                                className="form-select form-select-sm rounded-pill shadow-sm"
                                style={{ width: "auto" }}
                            >
                                <option value="6">6</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                            </select>
                        </div>
                    </div>
                </>
            )}

            <style jsx>{`
        .course-card {
          transition: all 0.3s ease;
        }
        .course-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        .course-image:hover {
          transform: scale(1.05);
        }
        .form-control:hover,
        .form-select:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .badge {
          font-size: 0.7rem;
          font-weight: 600;
        }
        @media (max-width: 768px) {
          .container-fluid {
            padding: 0 10px;
          }
        }
      `}</style>
        </div>
    );
}
