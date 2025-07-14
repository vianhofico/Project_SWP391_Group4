import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/axiosConfig";

export default function EditLessonForm() {
  const { chapterId, lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mainVideoUrl, setMainVideoUrl] = useState("");
  const [videoViewUrl, setVideoViewUrl] = useState(""); // ✅ signed URL để mở video
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await apiClient.get(`/admin/chapter/${chapterId}/lessons/${lessonId}`);
        const data = res.data;

        if (data && data.lessonId) {
          setLesson(data);
          setTitle(data.title || "");
          setContent(data.content || "");
          setMainVideoUrl(data.mainVideoUrl || "");
          setStatus(data.status === "Inactive" ? "Inactive" : "Active");

          if (data.mainVideoUrl) {
            const videoRes = await apiClient.post("/file/public/signed-url/view", {
              objectName: data.mainVideoUrl,
              folder: "mainvideo",
              type: "video",
            });
            setVideoViewUrl(videoRes.data.signedUrl);
          }
        } else {
          setLesson(null);
        }
      } catch (err) {
        console.error("❌ Error fetching lesson:", err);
        alert("Failed to fetch lesson data.");
      } finally {
        setLoading(false);
      }
    };

    if (chapterId && lessonId) {
      fetchLesson();
    }
  }, [chapterId, lessonId]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await apiClient.put(`/admin/chapter/${chapterId}/lessons/${lessonId}`, {
        title,
        content,
        mainVideoUrl,
        status,
      });
      alert("✅ Lesson updated successfully!");
      navigate(-1);
    } catch (err) {
      console.error("❌ Error updating lesson:", err);
      alert("Failed to update lesson.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-500">Loading lesson data...</p>;
  }

  if (!lesson || !lesson.lessonId) {
    return (
      <div className="p-6 text-red-600">
        ❌ Lesson not found. Please check the URL or try again later.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-6">✏️ Edit Lesson</h2>

      <div className="mb-5">
        <label className="block mb-1 font-medium">📝 Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-5">
        <label className="block mb-1 font-medium">📄 Content</label>
        <textarea
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-5">
        <label className="block mb-1 font-medium">🎬 Main Video File Name</label>
        <input
          type="text"
          value={mainVideoUrl}
          onChange={(e) => setMainVideoUrl(e.target.value)}
          placeholder="e.g. lesson01.mp4"
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ✅ Link để mở video thay vì phát video */}
      {videoViewUrl ? (
        <div className="mb-6">
          <label className="block mb-2 font-medium">🎥 Current Video URL</label>
          <a
            href={videoViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Click to view video
          </a>
        </div>
      ) : (
        <div className="text-sm text-gray-500">Chưa có video hiển thị</div>
      )}

      <div className="mb-5">
        <label className="block mb-1 font-medium">📌 Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <button
        onClick={handleUpdate}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-60"
        disabled={saving}
      >
        {saving ? "Đang lưu..." : "💾 Cập nhật bài học"}
      </button>
    </div>
  );
}
