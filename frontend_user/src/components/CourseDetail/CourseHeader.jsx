import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="text-yellow-500" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-500" />);
    }
  }
  return stars;
};

const CourseHeader = ({ course }) => {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Thumbnail */}
      <div className="md:w-1/3">
        {course.signedImageUrl && (
          <img
            src={course.signedImageUrl}
            alt={course.title}
            className="rounded-xl shadow-md"
          />
        )}
      </div>

      {/* Info */}
      <div className="md:w-2/3">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          {course.title}
        </h1>
        <p className="text-gray-600 mb-2">{course.description}</p>

        <p className="text-gray-700 font-medium">
          Giá: <span className="text-red-600">{course.price}₫</span>
        </p>
        <p className="text-gray-700">
          Học viên:{" "}
          {Array.isArray(course.enrollmentIds)
            ? course.enrollmentIds.length
            : 0}
        </p>

        {/* ⭐ Hiển thị rating ngôi sao */}
        <div className="flex items-center gap-1 text-gray-700">
          {renderStars(course.rating || 0)}
          <span className="ml-2 text-sm text-gray-500">
            ({course.rating?.toFixed(1) || "Chưa có đánh giá"})
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
