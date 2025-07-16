import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../lib/axiosConfig";
import { publicApiClient } from "../lib/publicApiClient";
import Header from "../components/Header";
import CourseHeader from "../components/CourseDetail/CourseHeader";
import CourseContent from "../components/CourseDetail/CourseContent";
import CourseRatingForm from "../components/CourseRatingForm";

export default function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        let courseData;

        if (token) {
          console.log("✅ Có token trong localStorage:", token);
          const res = await apiClient.get(`/user/courses/${courseId}`);
          courseData = res.data;
          console.log("🔐 API có token /user/courses/:id =>", courseData);
        } else {
          console.warn("🚫 Không có token trong localStorage");
          const res = await publicApiClient.get(
            `/public/user/courses/${courseId}`
          );
          courseData = res.data;
          console.log(
            "🌐 API không có token /public/courses/:id =>",
            courseData
          );
        }

        // Lấy signed URL cho ảnh
        let signedImageUrl = null;
        if (courseData.imageUrl) {
          const imageRes = await apiClient.post(
            "/file/public/signed-url/view",
            {
              objectName: courseData.imageUrl,
              folder: "img",
              type: "img",
            }
          );
          signedImageUrl = imageRes.data.signedUrl;
        }

        // Lấy signed URL cho video dùng thử
        let signedVideoUrl = null;
        if (courseData.videoTrialUrl) {
          const videoRes = await apiClient.post(
            "/file/public/signed-url/view",
            {
              objectName: courseData.videoTrialUrl,
              folder: "videotrial",
              type: "video",
            }
          );
          signedVideoUrl = videoRes.data.signedUrl;
        }

        setCourse({
          ...courseData,
          signedImageUrl,
          signedVideoUrl,
        });
      } catch (err) {
        console.error("❌ Failed to load course detail", err);
        setError("Không thể tải thông tin khóa học. Vui lòng thử lại sau.");
      }
    };

    fetchCourse();
  }, [courseId]);

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!course) return <div className="p-6">Đang tải khóa học...</div>;

  return (
    <div className="font-sans">
      <Header />
      <div className="max-w-5xl mx-auto p-6">
        {/* Thông tin chung về khóa học */}
        <CourseHeader course={course} />

        {/* Hiển thị tiến độ nếu có */}
        {course.progress != null && (
          <div className="my-6">
            <h3 className="text-md font-semibold mb-1">📊 Tiến độ học</h3>
            <div className="w-full bg-gray-300 h-4 rounded-full">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {course.progress.toFixed(2)}%
            </p>
          </div>
        )}

        {/* Video dùng thử */}
        {course.signedVideoUrl && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">🎥 Video dùng thử</h2>
            <div className="border border-gray-300 rounded-xl p-4 bg-gray-50 shadow-sm">
              <video
                src={course.signedVideoUrl}
                controls
                className="w-full rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Nội dung khóa học */}
        <CourseContent />

        {/* Form đánh giá chỉ hiển thị nếu học viên đã hoàn thành và có token */}
        {course.progress === 100 && localStorage.getItem("accessToken") && (
          <CourseRatingForm
            courseId={course.courseId}
            onRated={() => {
              alert("🎉 Cảm ơn bạn đã đánh giá khóa học!");
            }}
          />
        )}
      </div>
    </div>
  );
}
