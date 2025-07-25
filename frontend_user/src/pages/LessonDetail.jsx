import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaPlay,
  FaCheck,
  FaDownload,
  FaArrowLeft,
  FaSpinner,
  FaFileAlt,
  FaVideo,
  FaExclamationTriangle,
} from "react-icons/fa";
import { apiClient } from "../lib/axiosConfig";

const LessonDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [mainVideoUrl, setMainVideoUrl] = useState("");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const fetchLessonDetail = async () => {
      try {
        // 🔹 Lấy chi tiết bài học
        const res = await apiClient.get(`/user/lesson/${lessonId}`);
        const lessonData = res.data;
        setLesson(lessonData);

        // 🔹 Gửi request START bài học
        await apiClient.post(`/user/lesson-progress/${lessonId}/start`);

        // 🔹 Lấy signed URL video chính (nếu có)
        if (lessonData.mainVideoUrl) {
          const videoRes = await apiClient.post(
            "/file/public/signed-url/view",
            {
              objectName: lessonData.mainVideoUrl,
              folder: "mainvideo",
              type: "video",
            }
          );
          setMainVideoUrl(videoRes.data.signedUrl);
        }

        // 🔹 Gọi API lấy tài nguyên bài học
        const resourceRes = await apiClient.get(
          `/user/resources/in-lesson/${lessonId}`
        );

        const resourcesWithSignedUrls = await Promise.all(
          resourceRes.data.content.map(async (resource) => {
            const fileUrlRes = await apiClient.post("/file/signed-url/view", {
              objectName: resource.url,
              folder: "resources",
              type: "document",
            });
            return {
              ...resource,
              signedUrl: fileUrlRes.data.signedUrl || fileUrlRes.data,
            };
          })
        );

        setResources(resourcesWithSignedUrls);
      } catch (err) {
        console.error("❌ Lỗi khi tải bài học:", err);
        setError("Không thể tải nội dung bài học. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchLessonDetail();
  }, [lessonId]);

  const handleCompleteLesson = async () => {
    try {
      setCompleting(true);
      await apiClient.post(`/user/lesson-progress/${lessonId}/complete`);
      setLesson((prev) => ({
        ...prev,
        isCompleted: true,
      }));
    } catch (err) {
      console.error("❌ Lỗi khi hoàn thành bài học:", err);
      alert("Không thể đánh dấu hoàn thành. Vui lòng thử lại.");
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <FaSpinner className="fa-spin text-primary fs-1 mb-3" />
          <h5 className="text-muted">Đang tải bài học...</h5>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-danger fs-1 mb-3" />
          <h5 className="text-danger mb-3">Có lỗi xảy ra</h5>
          <p className="text-muted mb-4">{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <FaFileAlt className="text-muted fs-1 mb-3" />
          <h5 className="text-muted">Bài học không tồn tại</h5>
          <button
            className="btn btn-secondary mt-3"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="me-2" />
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <div className="lesson-header">
        <div className="container">
          <div className="row align-items-center py-4">
            <div className="col-auto">
              <button
                className="btn btn-light btn-sm rounded-pill"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft className="me-2" />
                Quay lại
              </button>
            </div>
            <div className="col">
              <div className="lesson-breadcrumb">
                <h1 className="lesson-title mb-1">
                  Bài {lesson.lessonOrder}: {lesson.title}
                </h1>
                {lesson.isCompleted && (
                  <span className="badge bg-success rounded-pill">
                    <FaCheck className="me-1" />
                    Đã hoàn thành
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="row">
          {/* Main Content */}
          <div className="col-lg-8">
            {/* Video Section */}
            <div className="video-section mb-4">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                {mainVideoUrl ? (
                  <div className="video-container">
                    <div className="video-header">
                      <FaVideo className="me-2" />
                      <span>Video bài học</span>
                    </div>
                    <div className="ratio ratio-16x9">
                      <video
                        className="rounded-bottom"
                        controls
                        controlsList="nodownload"
                        crossOrigin="anonymous"
                        style={{ backgroundColor: "#000" }}
                      >
                        <source src={mainVideoUrl} type="video/mp4" />
                        Trình duyệt của bạn không hỗ trợ video.
                      </video>
                    </div>
                  </div>
                ) : (
                  <div className="no-video">
                    <FaVideo className="no-video-icon" />
                    <h6 className="mb-2">Chưa có video</h6>
                    <p className="text-muted small mb-0">
                      Bài học này chưa có video đi kèm
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="content-section mb-4">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-light border-0 py-3">
                  <h5 className="mb-0 fw-semibold">
                    <FaFileAlt className="me-2 text-primary" />
                    Nội dung bài học
                  </h5>
                </div>
                <div className="card-body p-4">
                  <div className="lesson-content">
                    {lesson.content ? (
                      <p className="mb-0 lh-lg">{lesson.content}</p>
                    ) : (
                      <p className="text-muted mb-0 fst-italic">
                        Bài học này chưa có nội dung mô tả chi tiết.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Progress Section */}
            <div className="progress-section mb-4">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4 text-center">
                  {lesson.isCompleted ? (
                    <div className="completed-state">
                      <div className="success-icon mb-3">
                        <FaCheck />
                      </div>
                      <h6 className="text-success fw-semibold mb-2">
                        Hoàn thành!
                      </h6>
                      <p className="text-muted small mb-0">
                        Bạn đã hoàn thành bài học này
                      </p>
                    </div>
                  ) : (
                    <div className="incomplete-state">
                      <div className="play-icon mb-3">
                        <FaPlay />
                      </div>
                      <h6 className="fw-semibold mb-3">Hoàn thành bài học</h6>
                      <button
                        onClick={handleCompleteLesson}
                        className="btn btn-success rounded-pill px-4 py-2 fw-semibold"
                        disabled={completing}
                      >
                        {completing ? (
                          <>
                            <FaSpinner className="fa-spin me-2" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <FaCheck className="me-2" />
                            Đánh dấu hoàn thành
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Resources Section */}
            {resources.length > 0 && (
              <div className="resources-section">
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-header bg-light border-0 py-3">
                    <h6 className="mb-0 fw-semibold">
                      <FaDownload className="me-2 text-primary" />
                      Tài nguyên đi kèm ({resources.length})
                    </h6>
                  </div>
                  <div className="card-body p-0">
                    <div className="resources-list">
                      {resources.map((resource, index) => (
                        <div key={resource.id} className="resource-item">
                          <div className="resource-info">
                            <div className="resource-icon">
                              <FaFileAlt />
                            </div>
                            <div className="resource-details">
                              <div className="resource-title">
                                {resource.title || resource.url}
                              </div>
                              <div className="resource-type">
                                {resource.type}
                              </div>
                            </div>
                          </div>
                          <a
                            href={resource.signedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-primary btn-sm rounded-pill"
                          >
                            <FaDownload className="me-1" />
                            Tải về
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .lesson-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .lesson-title {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
        }

        .video-container {
          background: white;
        }

        .video-header {
          background: #f8f9fa;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e9ecef;
          font-weight: 500;
          color: #495057;
        }

        .no-video {
          padding: 4rem 2rem;
          text-align: center;
          background: #f8f9fa;
        }

        .no-video-icon {
          font-size: 3rem;
          color: #dee2e6;
          margin-bottom: 1rem;
        }

        .lesson-content {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #495057;
        }

        .success-icon,
        .play-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          font-size: 1.5rem;
        }

        .success-icon {
          background: rgba(25, 135, 84, 0.1);
          color: #198754;
        }

        .play-icon {
          background: rgba(13, 110, 253, 0.1);
          color: #0d6efd;
        }

        .resources-list {
          padding: 0;
        }

        .resource-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e9ecef;
          transition: background-color 0.2s ease;
        }

        .resource-item:last-child {
          border-bottom: none;
        }

        .resource-item:hover {
          background: #f8f9fa;
        }

        .resource-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .resource-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: rgba(13, 110, 253, 0.1);
          color: #0d6efd;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .resource-title {
          font-weight: 500;
          color: #2c3e50;
          margin-bottom: 0.25rem;
          font-size: 0.95rem;
        }

        .resource-type {
          font-size: 0.8rem;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
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

        /* Responsive */
        @media (max-width: 768px) {
          .lesson-title {
            font-size: 1.4rem;
          }

          .resource-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .resource-info {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default LessonDetail;
