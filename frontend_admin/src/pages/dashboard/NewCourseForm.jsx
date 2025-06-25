import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/axiosConfig";

export default function NewCourseForm() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [topicId, setTopicId] = useState("");

  const [topics, setTopics] = useState([]);

  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(false);

  // 🔁 Load topic list on mount
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await apiClient.get("/admin/topics");
        setTopics(res.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách topics:", error);
        alert("Không thể tải danh sách chủ đề.");
      }
    };
    fetchTopics();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const uploadToGCS = async (file, type = "image") => {
    if (!file) throw new Error("Không có file để upload");

    const folder = type === "image" ? "img" : "videotrial";

    const res = await apiClient.post("/file/signed-url/upload", {
      objectName: file.name,
      type: file.type,
      folder,
    });

    const { signedUrl } = res.data;

    await fetch(signedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    return file.name;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";
      let videoTrialUrl = "";

      if (imageFile) imageUrl = await uploadToGCS(imageFile, "image");
      if (videoFile) videoTrialUrl = await uploadToGCS(videoFile, "video");

      const courseData = {
        title,
        description,
        price: Number(price),
        imageUrl,
        videoTrialUrl,
        topicId: Number(topicId),
      };

      await apiClient.post("/admin/courses", courseData);

      alert("✅ Tạo khóa học thành công!");
      navigate("/admin/courses");
    } catch (err) {
      console.error("❌ Lỗi khi tạo khóa học:", err);
      alert("Đã xảy ra lỗi khi tạo khóa học.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white p-8 rounded-2xl shadow-lg space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 text-center">🎓 Tạo khóa học mới</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold text-gray-700">Tên khóa học</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full mt-2 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Mô tả</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full mt-2 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Giá (VNĐ)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full mt-2 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Chủ đề khóa học</label>
          <select
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            required
            className="w-full mt-2 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn chủ đề --</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Ảnh đại diện</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="mt-2" />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Xem trước ảnh"
              className="mt-4 rounded-xl max-h-60 border border-gray-300"
            />
          )}
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Video giới thiệu (Trial)</label>
          <input type="file" accept="video/*" onChange={handleVideoChange} className="mt-2" />
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Đang tạo..." : "Tạo khóa học"}
          </button>
        </div>
      </form>
    </div>
  );
}
