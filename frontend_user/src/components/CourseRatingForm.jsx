import React, { useState } from "react";
import {
  FaStar,
  FaRegStar,
  FaPaperPlane,
  FaExclamationCircle,
  FaSpinner,
} from "react-icons/fa";
import { apiClient } from "../lib/axiosConfig";

const CourseRatingForm = ({ courseId, onRated }) => {
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseId) {
      setError("Không xác định được khóa học.");
      return;
    }

    if (!comment.trim()) {
      setError("Vui lòng nhập nhận xét của bạn.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      console.log("📦 Gửi đánh giá cho courseId:", courseId);

      await apiClient.post("/ratings", {
        courseId,
        score,
        comment: comment.trim(),
      });

      setError("");
      setComment("");
      alert("Đánh giá thành công!");
      onRated?.(); // gọi callback nếu có
    } catch (err) {
      console.error("❌ Lỗi đánh giá:", err);
      const code = err?.response?.data?.code;

      switch (code) {
        case "COURSE_NOT_ENROLLED":
        case 12345: // fallback code phía backend gửi
          setError("Bạn chưa đăng ký khóa học này.");
          break;
        case "COURSE_NOT_COMPLETED":
          setError("Bạn cần hoàn thành khóa học trước khi đánh giá.");
          break;
        default:
          setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    const currentRating = hoverRating || score;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className={`star-button ${
            i <= currentRating ? "star-filled" : "star-empty"
          }`}
          onClick={() => setScore(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
        >
          {i <= currentRating ? (
            <FaStar className="star-icon" />
          ) : (
            <FaRegStar className="star-icon" />
          )}
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="rating-form-container">
      <form onSubmit={handleSubmit}>
        {/* Rating Stars */}
        <div className="mb-4">
          <label className="form-label fw-semibold mb-3">
            <FaStar className="text-warning me-2" />
            Đánh giá của bạn
          </label>
          <div className="rating-section">
            <div className="stars-container">{renderStars()}</div>
            <div className="rating-text">
              <span className="badge bg-primary rounded-pill px-3 py-2">
                {score} {score === 1 ? "sao" : "sao"}
              </span>
            </div>
          </div>
        </div>

        {/* Comment Textarea */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Nhận xét chi tiết</label>
          <textarea
            className="form-control form-control-lg"
            rows={4}
            placeholder="Chia sẻ trải nghiệm của bạn về khóa học này..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={submitting}
            maxLength={500}
          />
          <div className="form-text d-flex justify-content-between">
            <span>
              Hãy chia sẻ cảm nhận thật lòng để giúp các học viên khác
            </span>
            <span className="text-muted">{comment.length}/500</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className="alert alert-danger d-flex align-items-center mb-4"
            role="alert"
          >
            <FaExclamationCircle className="me-2" />
            <div>{error}</div>
          </div>
        )}

        {/* Submit Button */}
        <div className="d-grid">
          <button
            type="submit"
            className="btn btn-primary btn-lg rounded-pill py-3 fw-semibold"
            disabled={submitting || !comment.trim()}
          >
            {submitting ? (
              <>
                <FaSpinner className="fa-spin me-2" />
                Đang gửi đánh giá...
              </>
            ) : (
              <>
                <FaPaperPlane className="me-2" />
                Gửi đánh giá
              </>
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        .rating-form-container {
          background: white;
          padding: 0;
        }

        .rating-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 12px;
          border: 2px dashed #dee2e6;
          transition: all 0.3s ease;
        }

        .rating-section:hover {
          border-color: #0d6efd;
          background: #e7f3ff;
        }

        .stars-container {
          display: flex;
          gap: 0.25rem;
        }

        .star-button {
          background: none;
          border: none;
          padding: 0.25rem;
          cursor: pointer;
          transition: transform 0.2s ease;
          border-radius: 4px;
        }

        .star-button:hover {
          transform: scale(1.2);
        }

        .star-button:focus {
          outline: 2px solid #0d6efd;
          outline-offset: 2px;
        }

        .star-icon {
          font-size: 1.5rem;
          transition: color 0.2s ease;
        }

        .star-filled .star-icon {
          color: #ffc107;
          filter: drop-shadow(0 2px 4px rgba(255, 193, 7, 0.3));
        }

        .star-empty .star-icon {
          color: #dee2e6;
        }

        .star-empty:hover .star-icon {
          color: #ffc107;
        }

        .rating-text {
          margin-left: auto;
        }

        .form-control:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
        }

        .form-control:disabled {
          background-color: #f8f9fa;
          opacity: 0.8;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .fa-spin {
          animation: fa-spin 2s infinite linear;
        }

        @keyframes fa-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Animation cho submit button */
        .btn-primary {
          background: linear-gradient(135deg, #0d6efd 0%, #0056b3 100%);
          border: none;
          transition: all 0.3s ease;
        }

        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(13, 110, 253, 0.3);
        }

        .btn-primary:active {
          transform: translateY(0);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .rating-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .stars-container {
            align-self: center;
          }

          .rating-text {
            margin-left: 0;
            align-self: center;
          }

          .star-icon {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CourseRatingForm;
