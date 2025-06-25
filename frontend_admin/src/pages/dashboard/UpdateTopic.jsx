import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/axiosConfig";

const UpdateTopic = ({ topicId, onUpdateSuccess }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(false); // false = INACTIVE, true = ACTIVE
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const res = await apiClient.get(`/admin/topics/${topicId}`);
        const topic = res.data;

        console.log("Fetched topic:", topic);

        setName(topic.name || "");
        setDescription(topic.description || "");

        // Sửa lỗi so sánh sai
        const topicStatus = topic.status?.toUpperCase();
        if (topicStatus === "ACTIVE") {
          setStatus(true);
        } else if (topicStatus === "INACTIVE") {
          setStatus(false);
        } else {
          console.warn("⚠️ Trạng thái topic không xác định:", topic.status);
          setStatus(false);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin topic:", error);
        alert("Không thể tải dữ liệu chủ đề.");
      }
    };

    if (topicId) fetchTopic();
  }, [topicId]);

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Tên chủ đề không được để trống.");
      return;
    }

    setLoading(true);
    try {
      await apiClient.put(`/admin/topics/${topicId}`, {
        name,
        description,
        status: status ? "ACTIVE" : "INACTIVE",
      });
      alert("✅ Cập nhật chủ đề thành công!");
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("❌ Cập nhật thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-lg mx-auto space-y-5 mt-8">
      <h2 className="text-2xl font-bold text-gray-800">Chỉnh sửa chủ đề</h2>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Tên chủ đề</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Mô tả</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Trạng thái</label>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setStatus(true)}
            className={`px-4 py-2 rounded ${
              status ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => setStatus(false)}
            className={`px-4 py-2 rounded ${
              !status ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Inactive
          </button>
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
};

export default UpdateTopic;
