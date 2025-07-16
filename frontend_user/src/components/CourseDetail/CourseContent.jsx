import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../../lib/axiosConfig";

const CourseContent = () => {
  const { courseId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const hasToken = !!localStorage.getItem("accessToken");

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
    return <div className="text-center py-8 text-lg">Đang tải nội dung...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Nội dung khóa học</h1>
      {chapters.length === 0 ? (
        <div className="text-center text-gray-500">Không có nội dung nào</div>
      ) : (
        chapters.map((chapter) => (
          <div key={chapter.chapterId} className="mb-6">
            <div className="bg-sky-500 text-white px-4 py-2 rounded-t-lg font-semibold">
              Chapter {chapter.chapterOrder}: {chapter.title.toUpperCase()}
            </div>
            <div className="border border-gray-200 rounded-b-lg divide-y">
              {chapter.lessons.length === 0 ? (
                <div className="p-4 text-gray-500">Không có bài học nào</div>
              ) : (
                chapter.lessons.map((lesson) => (
                  <div
                    key={lesson.lessonId}
                    onClick={() =>
                      !lesson.isLocked &&
                      navigate(`/learn/lesson/${lesson.lessonId}`)
                    }
                    className={`flex items-center justify-between px-4 py-3 hover:bg-gray-100 cursor-pointer ${
                      lesson.isCompleted ? "bg-green-100" : ""
                    } ${
                      lesson.isLocked ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-blue-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-5.197-3.028A1 1 0 008 9.028v5.944a1 1 0 001.555.832l5.197-3.028a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12A9 9 0 113 12a9 9 0 0118 0z"
                          />
                        </svg>
                      </span>
                      <span>
                        Lesson {lesson.lessonOrder}: {lesson.title}
                        {lesson.isCompleted && (
                          <span className="ml-2 text-green-600 text-sm font-semibold">
                            (Đã học)
                          </span>
                        )}
                        {lesson.isLocked && (
                          <span className="ml-2 text-red-500 text-sm font-semibold">
                            (Đã khóa)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CourseContent;
