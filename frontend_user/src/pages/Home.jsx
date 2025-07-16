import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import FeatureCourseList from "../components/FeatureCourseList";

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <FeatureCourseList />{" "}
      {/* ✅ Đúng: đây là component render danh sách course */}
    </>
  );
};

export default Home;
