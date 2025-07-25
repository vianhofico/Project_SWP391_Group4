import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/axiosConfig";

export default function EditCourseForm() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    status: "",
    imageUrl: "",
    videoTrialUrl: "",
  });

  const [viewUrls, setViewUrls] = useState({ image: "", video: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const getSignedViewUrl = async (objectName, folder, type) => {
    try {
      const res = await apiClient.post("/file/public/signed-url/view", {
        objectName,
        folder,
        type,
      });
      return res.data.signedUrl;
    } catch (err) {
      console.error("❌ Error getting signed URL:", err);
      return "";
    }
  };

  const fetchCourse = async () => {
    try {
      const { data } = await apiClient.get(`/admin/courses/${courseId}`);
      setFormData(data);

      const [imageUrl, videoUrl] = await Promise.all([
        data.imageUrl
          ? getSignedViewUrl(data.imageUrl, "img", "img")
          : "",
        data.videoTrialUrl
          ? getSignedViewUrl(data.videoTrialUrl, "videotrial", "video")
          : "",
      ]);

      setViewUrls({ image: imageUrl, video: videoUrl });
    } catch (err) {
      console.error("❌ Failed to fetch course:", err);
      setError("Không thể tải thông tin khóa học.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchCourse();
  }, [courseId]);

  const handleUpload = async (e, field, folder, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const objectName = `${Date.now()}-${file.name}`;
    try {
      const res = await apiClient.post("/file/signed-url/upload", {
        objectName,
        folder,
        type: file.type,
      });

      await fetch(res.data.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      setFormData((prev) => ({ ...prev, [field]: objectName }));

      const signedUrl = await getSignedViewUrl(objectName, folder, type);
      setViewUrls((prev) => ({
        ...prev,
        [field === "imageUrl" ? "image" : "video"]: signedUrl,
      }));
    } catch (err) {
      console.error("❌ Upload failed:", err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.put(`/admin/courses/${courseId}`, formData);
      alert("✅ Cập nhật khóa học thành công!");
    } catch (err) {
      console.error("❌ Failed to save course:", err);
      setError("Không thể lưu thay đổi.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🛠 Sửa khóa học</h1>
        <button
          onClick={() => navigate(`/dashboard/admin/courses/${courseId}/chapters`)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Quản lý chương học
        </button>
      </div>

      {["title", "description", "price", "status"].map((field) => (
        <div className="mb-4" key={field}>
          <label className="block font-semibold capitalize mb-1">{field}</label>
          <input
            type={field === "price" ? "number" : "text"}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      ))}

      <div className="mb-4">
        <label className="block font-semibold mb-1">Ảnh khóa học</label>
        {viewUrls.image && (
          <img
            src={viewUrls.image}
            alt="Course"
            className="w-full max-h-64 object-cover mb-2 rounded border"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e, "imageUrl", "img", "img")}
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Video dùng thử</label>
        {viewUrls.video && (
          <video
            src={viewUrls.video}
            controls
            className="w-full max-h-80 rounded border mb-2"
          />
        )}
        <input
          type="file"
          accept="video/*"
          onChange={(e) => handleUpload(e, "videoTrialUrl", "videotrial", "video")}
        />
      </div>

      <button
        disabled={saving}
        onClick={handleSave}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {saving ? "Đang lưu..." : "💾 Lưu thay đổi"}
      </button>
    </div>
  );
}
