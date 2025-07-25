import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Navigation
import { Navigation } from "./components/navigation";

// Trang chính
import Home from "./components/Home"; // đổi nếu bạn muốn dùng ../pages/Home.jsx
import JsonData from "./data/data.json";

// Auth
import SignIn from "./components/Auth/sign-in.jsx";
import SignUp from "./components/Auth/sign-up.jsx";

// Khóa học
import { AllCourses } from "./components/AllCourses";
import CourseDetail from "./pages/CourseDetail.jsx";
import MyCourses from "./components/MyCourse";

// Học bài
import LessonDetail from "./pages/LessonDetail.jsx";

// Giỏ hàng và đơn hàng
import CartDetail from "./components/CartDetail";
import CheckoutPage from "./components/CheckoutPage";
import OrderHistory from "./components/OrderHistory";
import OrderItems from "./components/OrderItems";

// Tài khoản
import AccountSettings from "./components/AccountSetting";

import "./App.css";
import Forum from "@/components/forum/forum";
import DetailPost from "@/components/forum/detailPost";
import CreatePost from "@/components/forum/CreatePost";

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});

  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <BrowserRouter basename={`/g4course`}>
      <Navigation />
      <Routes>
        {/* Trang chính */}
        <Route path="/" element={<Home landingPageData={landingPageData} />} />

        {/* Đăng nhập / đăng ký */}
        <Route path="/login" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Giỏ hàng và thanh toán */}
        <Route path="/cart" element={<CartDetail />} />
        <Route path="/confirm-checkout" element={<CheckoutPage />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/order-items" element={<OrderItems />} />

        {/* Tài khoản */}
        <Route path="/account-settings" element={<AccountSettings />} />

        {/* Khóa học */}
        <Route path="/courses" element={<AllCourses />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/my-courses" element={<MyCourses />} />

        {/* Bài học */}
        <Route path="/learn/lesson/:lessonId" element={<LessonDetail />} />

        <Route path="/forum" element={<Forum />} />
        <Route path="/forum/:postId" element={<DetailPost />} />
        <Route path="/forum/newPost" element={<CreatePost />} />

        {/* Mặc định */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
// import React, { useEffect, useState } from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { Navigation } from "./components/navigation";
// import JsonData from "./data/data.json";
// import CartDetail from "./components/CartDetail";
// import OrderHistory from "./components/OrderHistory";
// import OrderItems from "./components/OrderItems";
// import CheckoutPage from "./components/CheckoutPage";
// import Home from "./components/Home";
// import SignIn from "./components/sign-in";
// import SignUp from "./components/sign-up";
// import AccountSettings from "./components/AccountSetting";
// import MyCourses from "./components/MyCourse";
// import { AllCourses } from "./components/AllCourses";
// import "./App.css";

// const App = () => {
//   const [landingPageData, setLandingPageData] = useState({});

//   useEffect(() => {
//     setLandingPageData(JsonData);
//   }, []);

//   return (
//     <BrowserRouter>
//       <Navigation />
//       <Routes>
//         <Route path="/" element={<Home landingPageData={landingPageData} />} />
//         <Route path="/login" element={<SignIn />} />
//         <Route path="/sign-up" element={<SignUp />} />
//         <Route path="/cart" element={<CartDetail />} />
//         <Route path="/confirm-checkout" element={<CheckoutPage />} />
//         <Route path="/order-history" element={<OrderHistory />} />
//         <Route path="/order-items" element={<OrderItems />} />
//         <Route path="/account-settings" element={<AccountSettings />} />
//         <Route path="/my-courses" element={<MyCourses />} />
//         <Route path="/courses" element={<AllCourses />} />
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;
