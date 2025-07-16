import React from "react";

const CoursePreview = ({ signedVideoUrl }) => {
  if (!signedVideoUrl) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-2">Video học thử</h2>
      <video
        src={signedVideoUrl}
        controls
        className="w-full rounded-lg shadow-md"
      />
    </div>
  );
};

export default CoursePreview;
