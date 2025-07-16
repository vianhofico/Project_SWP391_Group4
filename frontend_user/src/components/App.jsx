import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import CourseDetail from "../pages/CourseDetail.jsx";
import SignIn from "./Auth/SignIn.jsx";
import SignUp from "./Auth/SignUp.jsx";
import AuthLayout from "../pages/AuthLayout.jsx";
import LessonDetail from "../pages/LessonDetail.jsx";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses/:courseId" element={<CourseDetail />} />
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
      </Route>
      <Route path="/learn/lesson/:lessonId" element={<LessonDetail />} />
    </Routes>
  );
};

export default App;
