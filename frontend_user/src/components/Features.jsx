import React from "react";
import FeatureItem from "./FeatureItem";

const Features = () => {
  return (
    <section
      id="features"
      className="relative w-full px-8 py-10 border-t border-gray-200 md:py-16 lg:py-24 xl:py-40 xl:px-0"
    >
      <div className="container flex flex-col items-center justify-between h-full max-w-6xl mx-auto">
        <h2 className="my-5 text-base font-medium tracking-tight text-indigo-500 uppercase">
          Our Features
        </h2>
        <h3 className="max-w-2xl px-5 mt-2 text-3xl font-black leading-tight text-center text-gray-900 sm:mt-0 sm:px-0 sm:text-6xl">
          Built and Designed with you in Mind
        </h3>

        <div className="flex flex-col w-full mt-10 lg:flex-row lg:mt-20">
          <FeatureItem
            title="Automated Tools"
            description="Automate your workflow with top-of-the-line marketing tools."
            icon={
              <svg
                viewBox="0 0 50 50"
                className="w-full h-full fill-indigo-500"
              >
                <circle cx="25" cy="25" r="25" />
              </svg>
            }
          />
          <FeatureItem
            title="Machine Learning"
            description="Leverage AI-powered features to gain insights."
            icon={
              <svg viewBox="0 0 50 50" className="w-full h-full fill-pink-500">
                <rect width="50" height="50" />
              </svg>
            }
          />
          <FeatureItem
            title="Scalable API"
            description="Our API grows with your business needs."
            icon={
              <svg
                viewBox="0 0 50 50"
                className="w-full h-full fill-yellow-500"
              >
                <polygon points="25,0 50,50 0,50" />
              </svg>
            }
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
