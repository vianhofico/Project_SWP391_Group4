import React from "react";

const FeatureItem = ({ icon, title, description }) => {
  return (
    <div className="w-full max-w-md p-4 mx-auto mb-0 sm:mb-16 lg:mb-0 lg:w-1/3">
      <div className="relative flex flex-col items-center justify-center w-full h-full p-10 text-center rounded-lg shadow-lg bg-white">
        <div className="w-20 h-20 mb-4">{icon}</div>
        <h4 className="text-lg font-bold">{title}</h4>
        <p className="mt-2 text-base text-gray-600">{description}</p>
        <a
          href="#_"
          className="mt-2 text-sm font-medium text-indigo-500 underline"
        >
          Learn More
        </a>
      </div>
    </div>
  );
};

export default FeatureItem;
