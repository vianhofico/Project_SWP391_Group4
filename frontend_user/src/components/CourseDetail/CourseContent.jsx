import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPlay, FaCheck, FaLock, FaBook, FaSpinner } from "react-icons/fa";
import { apiClient } from "../../lib/axiosConfig";

const CourseContent = () => {
  const { courseId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const hasToken = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchChaptersAndLessons = async () => {
      try {
        const chapterRes = await apiClient.get(
          `/public/user/course/${courseId}/chapters?page=0&size=100`
        );
        const chapterData = chapterRes.data.content || [];

        const chapterWithLessons = await Promise.all(
          chapterData.map(async (chapter) => {
            try {
              const lessonApi = hasToken
                ? `/user/chapters/${chapter.chapterId}/lessons`
                : `/public/user/chapter/${chapter.chapterId}/lessons?page=0&size=100`;

              const res = await apiClient.get(lessonApi);
              const lessons = Array.isArray(res.data)
                ? res.data
                : res.data.content || [];

              lessons.sort((a, b) => a.lessonOrder - b.lessonOrder);
              return { ...chapter, lessons };
            } catch {
              return { ...chapter, lessons: [] };
            }
          })
        );

        chapterWithLessons.sort((a, b) => a.chapterOrder - b.chapterOrder);
        setChapters(chapterWithLessons);
      } catch (err) {
        console.error("❌ Lỗi khi tải chương:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChaptersAndLessons();
  }, [courseId, hasToken]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <FaSpinner className="fa-spin text-primary fs-2 mb-3" />
        <p className="text-muted fs-5">Đang tải nội dung khóa học...</p>
      </div>
    );
  }

  if (chapters.length === 0) {
    return (
      <div className="text-center py-5">
        <FaBook className="text-muted fs-1 mb-3" />
        <h5 className="text-muted">Chưa có nội dung nào</h5>
        <p className="text-muted small">
          Khóa học này chưa có chương hoặc bài học nào.
        </p>
      </div>
    );
  }

  return (
    <div className="course-content">
      {chapters.map((chapter, chapterIndex) => (
        <div key={chapter.chapterId} className="chapter-section mb-4">
          {/* Chapter Header */}
          <div className="chapter-header">
            <div className="d-flex align-items-center">
              <div className="chapter-number">{chapter.chapterOrder}</div>
              <div className="chapter-info">
                <h5 className="chapter-title mb-1">{chapter.title}</h5>
                <small className="chapter-meta">
                  {chapter.lessons.length} bài học
                </small>
              </div>
            </div>
          </div>

          {/* Lessons List */}
          <div className="lessons-container">
            {chapter.lessons.length === 0 ? (
              <div className="empty-lessons">
                <p className="text-muted mb-0">
                  <FaBook className="me-2" />
                  Chương này chưa có bài học nào
                </p>
              </div>
            ) : (
              <div className="lessons-list">
                {chapter.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lesson.lessonId}
                    onClick={() =>
                      !lesson.isLocked &&
                      navigate(`/learn/lesson/${lesson.lessonId}`)
                    }
                    className={`lesson-item ${
                      lesson.isCompleted ? "lesson-completed" : ""
                    } ${
                      lesson.isLocked ? "lesson-locked" : "lesson-available"
                    }`}
                  >
                    <div className="lesson-content">
                      {/* Lesson Status Icon */}
                      <div className="lesson-icon">
                        {lesson.isCompleted ? (
                          <FaCheck className="text-success" />
                        ) : lesson.isLocked ? (
                          <FaLock className="text-muted" />
                        ) : (
                          <FaPlay className="text-primary" />
                        )}
                      </div>

                      {/* Lesson Info */}
                      <div className="lesson-info">
                        <div className="lesson-title">
                          Bài {lesson.lessonOrder}: {lesson.title}
                        </div>
                        <div className="lesson-status">
                          {lesson.isCompleted && (
                            <span className="badge bg-success me-2">
                              <FaCheck className="me-1" />
                              Đã hoàn thành
                            </span>
                          )}
                          {lesson.isLocked && (
                            <span className="badge bg-secondary me-2">
                              <FaLock className="me-1" />
                              Đã khóa
                            </span>
                          )}
                          {!lesson.isCompleted && !lesson.isLocked && (
                            <span className="badge bg-primary me-2">
                              <FaPlay className="me-1" />
                              Sẵn sàng học
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      {!lesson.isLocked && (
                        <div className="lesson-arrow">
                          <i className="fas fa-chevron-right"></i>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      <style jsx>{`
        .course-content {
          padding: 0;
        }

        .chapter-section {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          background: white;
        }

        .chapter-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1.5rem;
        }

        .chapter-number {
          background: rgba(255, 255, 255, 0.2);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
          margin-right: 1rem;
          backdrop-filter: blur(10px);
        }

        .chapter-info {
          flex: 1;
        }

        .chapter-title {
          font-weight: 600;
          font-size: 1.3rem;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .chapter-meta {
          opacity: 0.9;
          font-size: 0.9rem;
        }

        .lessons-container {
          background: #f8f9fa;
        }

        .empty-lessons {
          padding: 2rem;
          text-align: center;
        }

        .lessons-list {
          padding: 0;
        }

        .lesson-item {
          border-bottom: 1px solid #e9ecef;
          transition: all 0.3s ease;
          position: relative;
        }

        .lesson-item:last-child {
          border-bottom: none;
        }

        .lesson-item:hover:not(.lesson-locked) {
          background: #e3f2fd;
          transform: translateX(5px);
        }

        .lesson-available {
          cursor: pointer;
        }

        .lesson-locked {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .lesson-completed {
          background: linear-gradient(
            90deg,
            rgba(76, 175, 80, 0.1) 0%,
            transparent 100%
          );
        }

        .lesson-content {
          display: flex;
          align-items: center;
          padding: 1.25rem 1.5rem;
          gap: 1rem;
        }

        .lesson-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          font-size: 1.1rem;
        }

        .lesson-info {
          flex: 1;
        }

        .lesson-title {
          font-weight: 500;
          color: #2c3e50;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .lesson-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .lesson-arrow {
          color: #667eea;
          font-size: 1.2rem;
          opacity: 0.5;
          transition: all 0.3s ease;
        }

        .lesson-item:hover .lesson-arrow {
          opacity: 1;
          transform: translateX(5px);
        }

        .badge {
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.4rem 0.8rem;
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
          .chapter-header {
            padding: 1rem;
          }

          .chapter-number {
            width: 40px;
            height: 40px;
            font-size: 1rem;
          }

          .chapter-title {
            font-size: 1.1rem;
          }

          .lesson-content {
            padding: 1rem;
            gap: 0.75rem;
          }

          .lesson-icon {
            width: 35px;
            height: 35px;
          }

          .lesson-title {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CourseContent;
