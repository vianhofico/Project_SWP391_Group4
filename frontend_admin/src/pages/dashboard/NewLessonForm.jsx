import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/axiosConfig";

export default function NewLessonForm() {
  const { chapterId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const uploadToGCS = async (file) => {
    if (!file) throw new Error("Không có file để upload");

    const res = await apiClient.post("/file/signed-url/upload", {
      objectName: file.name,
      type: file.type,
      folder: "mainvideo",
    });

    const { signedUrl } = res.data;

    await fetch(signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    return file.name; // Trả về tên file để lưu vào mainVideoUrl
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let mainVideoUrl = "";
      if (videoFile) {
        mainVideoUrl = await uploadToGCS(videoFile); // upload xong rồi lấy tên file
      }

      const lessonData = {
        title,
        content,
        mainVideoUrl, // ✅ tên đúng field backend
      };

      await apiClient.post(`/admin/chapter/${chapterId}/lessons`, lessonData);

      alert("✅ Tạo bài học thành công!");
      navigate(`/admin/chapters/${chapterId}/lessons`);
    } catch (err) {
      console.error("❌ Lỗi khi tạo bài học:", err);
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">📘 Tạo bài học mới</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-semibold text-gray-700">Tiêu đề bài học</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full mt-2 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Nội dung</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full mt-2 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Video chính của bài học</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="mt-2"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? "Đang tạo..." : "Tạo bài học"}
          </button>
        </div>
      </form>
    </div>
  );
}
