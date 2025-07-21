import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/axiosConfig";

const UpdateTopic = ({ topicId, onUpdateSuccess }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(false); // false = INACTIVE, true = ACTIVE
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchTopic = async () => {
      setInitialLoading(true);
      try {
        const res = await apiClient.get(`/admin/topics/${topicId}`);
        const topic = res.data;

        console.log("Fetched topic:", topic);

        setName(topic.name || "");
        setDescription(topic.description || "");

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
      } finally {
        setInitialLoading(false);
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

  if (initialLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl shadow-xl max-w-2xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-300 rounded-full"></div>
            <div className="h-6 bg-blue-300 rounded w-48"></div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-blue-200 rounded w-24"></div>
            <div className="h-12 bg-blue-200 rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-blue-200 rounded w-16"></div>
            <div className="h-24 bg-blue-200 rounded"></div>
          </div>
          <div className="h-12 bg-blue-300 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl shadow-xl max-w-2xl mx-auto border border-blue-200">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Chỉnh sửa chủ đề
          </h2>
          <p className="text-gray-600 mt-1">Cập nhật thông tin chủ đề của bạn</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Topic Name */}
        <div className="group">
          <label className="block text-gray-800 font-semibold mb-3 text-lg">
            Tên chủ đề
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-800 text-lg bg-white/70 backdrop-blur-sm"
              placeholder="Nhập tên chủ đề..."
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${name.trim() ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="group">
          <label className="block text-gray-800 font-semibold mb-3 text-lg">
            Mô tả
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-800 resize-none bg-white/70 backdrop-blur-sm"
            placeholder="Nhập mô tả cho chủ đề..."
          />
          <div className="text-right mt-2">
            <span className="text-sm text-gray-500">{description.length} ký tự</span>
          </div>
        </div>

        {/* Status */}
        <div className="group">
          <label className="block text-gray-800 font-semibold mb-4 text-lg">
            Trạng thái
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setStatus(true)}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 ${
                status 
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg ring-green-100" 
                  : "bg-white/70 text-gray-600 border-2 border-gray-200 hover:border-green-300"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${status ? 'bg-white' : 'bg-green-400'}`}></div>
                <span>Active</span>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setStatus(false)}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 ${
                !status 
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg ring-red-100" 
                  : "bg-white/70 text-gray-600 border-2 border-gray-200 hover:border-red-300"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${!status ? 'bg-white' : 'bg-red-400'}`}></div>
                <span>Inactive</span>
              </div>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={loading || !name.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-100 shadow-lg"
          >
            <div className="flex items-center justify-center space-x-3">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Lưu thay đổi</span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTopic;