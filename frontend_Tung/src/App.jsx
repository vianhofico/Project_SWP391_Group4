
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from "./components/navigation";
import JsonData from "./data/data.json";
import CartDetail from "./components/CartDetail";
import OrderHistory from "./components/OrderHistory";
import CheckoutPage from "./components/CheckoutPage";
import Home from "./components/Home";
import "./App.css";
import SignIn from "./components/auth_component/sign_in/sign-in";
import SignUp from "./components/auth_component/sign_up/SignUp";
import ResetPassword from "./components/auth_component/forgot_password/ResetPassword";

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});

  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home landingPageData={landingPageData} />} />
        <Route path="/cart" element={<CartDetail />} />
        <Route path="/confirm-checkout" element={<CheckoutPage />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/api/users/reset-password" element={<ResetPassword />} /> 
      </Routes>
    </BrowserRouter>
  );
};

export default App;
