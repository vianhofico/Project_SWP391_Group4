import React, { useState } from "react";
import { apiClient } from "../lib/axiosConfig";

const CourseRatingForm = ({ courseId, onRated }) => {
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!courseId) {
      setError("Không xác định được khóa học.");
      return;
    }

    try {
      console.log("📦 Gửi đánh giá cho courseId:", courseId);

      await apiClient.post("/ratings", {
        courseId,
        score,
        comment,
      });

      setError("");
      alert("Đánh giá thành công!");
      onRated?.(); // gọi callback nếu có
    } catch (err) {
      console.error("❌ Lỗi đánh giá:", err);
      const code = err?.response?.data?.code;

      switch (code) {
        case "COURSE_NOT_ENROLLED":
        case 12345: // fallback code phía backend gửi
          setError("Bạn chưa đăng ký khóa học này.");
          break;
        case "COURSE_NOT_COMPLETED":
          setError("Bạn cần hoàn thành khóa học trước khi đánh giá.");
          break;
        default:
          setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-xl shadow-sm bg-white">
      <h3 className="font-semibold text-lg mb-2">Đánh giá khóa học</h3>

      <div className="flex items-center gap-2 mb-3">
        <label className="text-sm">Số sao:</label>
        <select
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="border px-2 py-1 rounded"
        >
          {[5, 4, 3, 2, 1].map((s) => (
            <option key={s} value={s}>
              {s} sao
            </option>
          ))}
        </select>
      </div>

      <textarea
        className="w-full border rounded p-2 mb-2"
        rows={3}
        placeholder="Nhận xét của bạn"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Gửi đánh giá
      </button>
    </div>
  );
};

export default CourseRatingForm;
