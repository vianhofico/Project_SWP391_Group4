import React from "react";
import { Link } from "react-router-dom";
import useSecurePage from "../hooks/useSecurePage";
const FeatureCourseCard = ({ course }) => {
  if (!course) return null;
  // useSecurePage();
  return (
    <div className="w-full sm:w-1/2 lg:w-1/3 p-4 font-sans">
      <Link to={`/courses/${course.courseId}`}>
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition duration-300 ease-in-out transform hover:-translate-y-1">
          {course.signedImageUrl ? (
            <div className="w-52 h-52 mx-auto mb-4 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 ease-in-out">
              <img
                src={course.signedImageUrl}
                alt={course.title}
                className="w-full h-full object-cover transform hover:scale-105 transition duration-300 ease-in-out"
              />
            </div>
          ) : (
            <div className="w-52 h-52 mx-auto mb-4 bg-gray-200 rounded-2xl shadow-inner" />
          )}

          <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
            {course.title}
          </h3>

          <p className="mt-2 text-gray-600 text-sm">
            💰 Price:{" "}
            <span className="text-green-600 font-semibold">
              {course.price ?? "N/A"}
            </span>{" "}
            | ⭐ Rating: {course.rating?.toFixed(1) ?? "N/A"}
          </p>

          <p className="text-sm text-gray-500">
            👥 Learners:{" "}
            {Array.isArray(course.enrollmentIds)
              ? course.enrollmentIds.length
              : 0}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default FeatureCourseCard;
