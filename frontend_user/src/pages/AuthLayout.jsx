import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const AuthLayout = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Outlet />
      </div>
    </>
  );
};

export default AuthLayout;
