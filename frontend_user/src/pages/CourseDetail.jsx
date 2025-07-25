import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaUsers,
  FaPlay,
  FaChartLine,
  FaClock,
  FaBookOpen,
} from "react-icons/fa";
import { apiClient } from "../lib/axiosConfig";
import { publicApiClient } from "../lib/publicApiClient";
import { Header } from "../components/header";
import CourseContent from "../components/CourseDetail/CourseContent";
import CourseRatingForm from "../components/CourseRatingForm";

const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="text-warning" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-warning" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-muted" />);
    }
  }
  return stars;
};

const formatCurrency = (number) => {
  return number?.toLocaleString("vi-VN") + "₫";
};

const calculateDiscountedPrice = (price, discount) => {
  if (!discount) return price;
  const value = discount.discountValue;
  return discount.discountType === "PERCENT"
    ? Math.max(price * (1 - value / 100), 0)
    : Math.max(price - value, 0);
};

export default function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        let courseData;

        if (token) {
          const res = await apiClient.get(`/user/courses/${courseId}`);
          courseData = res.data;
        } else {
          const res = await publicApiClient.get(
            `/public/user/courses/${courseId}`
          );
          courseData = res.data;
        }

        // Fetch signed image URL if available
        let signedImageUrl = null;
        if (courseData.imageUrl) {
          const imageRes = await apiClient.post(
            "/file/public/signed-url/view",
            {
              objectName: courseData.imageUrl,
              folder: "img",
              type: "img",
            }
          );
          signedImageUrl = imageRes.data.signedUrl;
        }

        // Fetch signed video URL if available
        let signedVideoUrl = null;
        if (courseData.videoTrialUrl) {
          const videoRes = await apiClient.post(
            "/file/public/signed-url/view",
            {
              objectName: courseData.videoTrialUrl,
              folder: "videotrial",
              type: "video",
            }
          );
          signedVideoUrl = videoRes.data.signedUrl;
        }

        // Fetch discount info
        let discountData = null;
        try {
          const discountRes = await apiClient.get(
            `/client/discounts/course/${courseId}`
          );
          discountData = discountRes.data;
        } catch (err) {
          console.warn("⚠️ Không có discount cho course", courseId);
        }

        const discountedPrice = calculateDiscountedPrice(
          courseData.price,
          discountData
        );

        setCourse({
          ...courseData,
          signedImageUrl,
          signedVideoUrl,
          discount: discountData,
          discountedPrice,
        });
      } catch (err) {
        console.error("❌ Failed to load course detail", err);
        setError("Failed to load course information. Please try again later.");
      }
    };

    fetchCourse();
  }, [courseId]);

  if (error) {
    return (
      <>
        <Header />
        <div className="container-fluid bg-light min-vh-100 d-flex align-items-center">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="text-center">
                  <div className="mb-4">
                    <div className="error-icon">❌</div>
                  </div>
                  <h3 className="fw-bold text-dark mb-3">Có lỗi xảy ra</h3>
                  <p className="text-muted mb-4">{error}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => window.location.reload()}
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Header />
        <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <div className="loading-spinner mb-4"></div>
            <h5 className="text-primary fw-semibold">
              Đang tải thông tin khóa học...
            </h5>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      {/* Hero Banner */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container position-relative">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-8 text-white">
              <div className="hero-content">
                <h1 className="hero-title">{course.title}</h1>
                <p className="hero-description">{course.description}</p>

                <div className="hero-stats">
                  <div className="stat-item">
                    <FaUsers className="stat-icon" />
                    <span>
                      {Array.isArray(course.enrollmentIds)
                        ? course.enrollmentIds.length
                        : 0}{" "}
                      học viên
                    </span>
                  </div>
                  <div className="stat-item">
                    <div className="rating-stars">
                      {renderStars(course.rating || 0)}
                    </div>
                    <span>
                      ({course.rating?.toFixed(1) || "Chưa có đánh giá"})
                    </span>
                  </div>
                </div>

                <div className="price-section">
                  {course.discount ? (
                    <div className="price-with-discount">
                      <span className="current-price">
                        {formatCurrency(course.discountedPrice)}
                      </span>
                      <span className="original-price">
                        {formatCurrency(course.price)}
                      </span>
                      <span className="discount-badge">
                        {course.discount.discountType === "PERCENT"
                          ? `-${course.discount.discountValue}%`
                          : `-${formatCurrency(course.discount.discountValue)}`}
                      </span>
                    </div>
                  ) : (
                    <span className="current-price">
                      {formatCurrency(course.price)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="course-image-container">
                {course.signedImageUrl ? (
                  <img
                    src={course.signedImageUrl}
                    alt={course.title}
                    className="course-hero-image"
                  />
                ) : (
                  <div className="placeholder-image">
                    <FaBookOpen className="placeholder-icon" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container my-5">
        {/* Progress Section */}
        {course.progress != null && (
          <section className="mb-5">
            <div className="progress-card">
              <div className="progress-header">
                <FaChartLine className="progress-icon" />
                <h4>Tiến độ học tập</h4>
              </div>
              <div className="progress-body">
                <div className="progress-info">
                  <span>Hoàn thành</span>
                  <span className="progress-percentage">
                    {course.progress.toFixed(1)}%
                  </span>
                </div>
                <div className="custom-progress">
                  <div
                    className="progress-fill"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Trial Video */}
        {course.signedVideoUrl && (
          <section className="mb-5">
            <div className="video-card">
              <div className="video-header">
                <FaPlay className="video-icon" />
                <h4>Video dùng thử</h4>
              </div>
              <div className="video-container">
                <video
                  src={course.signedVideoUrl}
                  controls
                  className="course-video"
                />
              </div>
            </div>
          </section>
        )}

        {/* Course Content */}
        <section className="mb-5">
          <div className="content-card">
            <div className="content-header">
              <FaBookOpen className="content-icon" />
              <h4>Nội dung khóa học</h4>
            </div>
            <div className="content-body">
              <CourseContent />
            </div>
          </div>
        </section>

        {/* Rating Form */}
        {course.progress === 100 && localStorage.getItem("token") && (
          <section className="mb-5">
            <div className="rating-card">
              <div className="rating-header">
                <FaStar className="rating-icon" />
                <div>
                  <h4>Đánh giá khóa học</h4>
                  <p>Chia sẻ trải nghiệm của bạn với các học viên khác</p>
                </div>
              </div>
              <div className="rating-body">
                <CourseRatingForm
                  courseId={course.courseId}
                  onRated={() => {
                    alert("🎉 Cảm ơn bạn đã đánh giá khóa học!");
                  }}
                />
              </div>
            </div>
          </section>
        )}
      </div>

      <style jsx>{`
        .min-vh-75 {
          min-height: 75vh;
        }
        .min-vh-100 {
          min-height: 100vh;
        }

        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
        }

        .hero-content {
          padding: 60px 0;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .hero-description {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.95;
          line-height: 1.6;
        }

        .hero-stats {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .stat-icon,
        .rating-stars {
          color: #ffd700;
        }

        .price-section {
          margin-top: 2rem;
        }

        .price-with-discount {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .current-price {
          font-size: 2.5rem;
          font-weight: 800;
          color: #00ff88;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .original-price {
          font-size: 1.5rem;
          text-decoration: line-through;
          color: #ccc;
        }

        .discount-badge {
          background: #ff4757;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .course-image-container {
          display: flex;
          justify-content: center;
        }

        .course-hero-image {
          width: 100%;
          max-width: 400px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          transform: perspective(1000px) rotateY(-5deg);
          transition: transform 0.3s ease;
        }

        .course-hero-image:hover {
          transform: perspective(1000px) rotateY(0deg);
        }

        .placeholder-image {
          width: 100%;
          max-width: 400px;
          aspect-ratio: 16/9;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .placeholder-icon {
          font-size: 4rem;
          color: rgba(255, 255, 255, 0.5);
        }

        /* Card Styles */
        .progress-card,
        .video-card,
        .content-card,
        .rating-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .progress-card:hover,
        .video-card:hover,
        .content-card:hover,
        .rating-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .progress-header,
        .video-header,
        .content-header,
        .rating-header {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 1.5rem 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .progress-header h4,
        .video-header h4,
        .content-header h4,
        .rating-header h4 {
          margin: 0;
          font-weight: 600;
        }

        .rating-header p {
          margin: 0;
          opacity: 0.9;
          font-size: 0.9rem;
        }

        .progress-icon,
        .video-icon,
        .content-icon,
        .rating-icon {
          font-size: 1.5rem;
        }

        .progress-body,
        .content-body,
        .rating-body {
          padding: 2rem;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .progress-percentage {
          color: #667eea;
          font-weight: 600;
        }

        .custom-progress {
          height: 12px;
          background: #f1f3f4;
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          border-radius: 10px;
          transition: width 0.8s ease;
        }

        .video-container {
          padding: 2rem;
          background: #000;
        }

        .course-video {
          width: 100%;
          border-radius: 10px;
        }

        /* Loading Animation */
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .error-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-description {
            font-size: 1.1rem;
          }

          .current-price {
            font-size: 2rem;
          }

          .hero-stats {
            gap: 1rem;
          }

          .stat-item {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
}
