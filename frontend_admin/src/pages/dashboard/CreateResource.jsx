import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "@/lib/axiosConfig";

const CreateResource = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams(); // ✅ lấy lessonId từ URL nếu cần

  const [form, setForm] = useState({
    title: "",
    url: "",
    type: "document",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  const resourceTypes = ["document", "video", "image"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const uploadToGCS = async () => {
    if (!file) return null;

    setUploading(true);
    try {
      const objectName = `${Date.now()}_${file.name}`;
      const folder = "resources";
      const type = file.type;

      const { data } = await apiClient.post("/file/signed-url/upload", {
        objectName,
        folder,
        type,
      });

      await fetch(data.signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": type,
        },
        body: file,
      });

      return objectName; // ✅ chỉ lưu tên file
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("Lỗi khi upload file lên GCS.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let uploadedUrl = form.url;

    if (file) {
      const objectName = await uploadToGCS();
      if (!objectName) return setLoading(false);
      uploadedUrl = objectName;
    }

    try {
      const res = await apiClient.post("/admin/resources", {
        ...form,
        url: uploadedUrl,
      });

      alert("✅ Resource created successfully!");
      navigate(`/dashboard/admin/lessons/${lessonId}/resources`); // ✅ quay về trang resource theo lesson
    } catch (err) {
      console.error("❌ Failed to create resource:", err);
      alert("Tạo resource thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-4">➕ Tạo Resource mới</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Tiêu đề</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Loại Resource</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            {resourceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Tải file lên (hoặc nhập URL)</label>
          <input type="file" onChange={handleFileChange} className="mb-2" />
          <input
            type="text"
            name="url"
            value={form.url}
            onChange={handleChange}
            placeholder="Hoặc nhập URL nếu không upload"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {uploading
            ? "Đang upload file..."
            : loading
            ? "Đang tạo..."
            : "Tạo Resource"}
        </button>
      </form>
    </div>
  );
};

export default CreateResource;
