import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../lib/axiosConfig";

const LessonDetail = () => {
  const { lessonId } = useParams();
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
    return <div className="text-center py-8 text-lg">Đang tải bài học...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (!lesson) {
    return (
      <div className="text-center text-gray-500 py-8">
        Bài học không tồn tại
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Lesson {lesson.lessonOrder}: {lesson.title}
      </h1>

      {mainVideoUrl ? (
        <div className="mb-6">
          <video
            className="w-full rounded shadow"
            controls
            controlsList="nodownload"
            crossOrigin="anonymous"
          >
            <source src={mainVideoUrl} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        </div>
      ) : (
        <div className="mb-6 text-gray-500">Chưa có video cho bài học này</div>
      )}

      <div className="prose max-w-none">
        <h2 className="text-xl font-semibold mb-2">Nội dung bài học</h2>
        <p>{lesson.content || "Không có nội dung mô tả."}</p>
      </div>

      {resources.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Tài nguyên đi kèm:</h3>
          <ul className="list-disc ml-5 space-y-1">
            {resources.map((res) => (
              <li key={res.id}>
                <a
                  href={res.signedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  📄 {res.title || res.url}
                </a>{" "}
                <span className="text-sm text-gray-500">({res.type})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8">
        {lesson.isCompleted ? (
          <p className="text-green-600 font-semibold">
            🎉 Bạn đã hoàn thành bài học này.
          </p>
        ) : (
          <button
            onClick={handleCompleteLesson}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
            disabled={completing}
          >
            {completing ? "Đang hoàn thành..." : "✅ Hoàn thành bài học"}
          </button>
        )}
      </div>
    </div>
  );
};

export default LessonDetail;
