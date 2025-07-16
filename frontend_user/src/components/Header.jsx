import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Thêm import

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); // ✅ Hook chuyển trang

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 text-2xl font-extrabold text-indigo-600"
        >
          <svg
            className="w-8 h-8 fill-indigo-600"
            viewBox="0 0 194 116"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fillRule="evenodd">
              <path d="M96.869 0L30 116h104l-9.88-17.134H59.64l47.109-81.736zM0 116h19.831L77 17.135 67.088 0z" />
              <path d="M87 68.732l9.926 17.143 29.893-51.59L174.15 116H194L126.817 0z" />
            </g>
          </svg>
          <span>
            Landmark<span className="text-pink-500">.</span>
          </span>
        </a>

        {/* Nav */}
        <nav
          className={`flex-col md:flex-row md:flex gap-6 items-center text-sm md:static absolute top-full left-0 w-full md:w-auto bg-white shadow-md md:shadow-none transition-all duration-300 ease-in-out ${
            menuOpen ? "flex" : "hidden"
          }`}
        >
          <a
            href="#"
            className="text-gray-800 hover:text-indigo-600 font-semibold transition"
          >
            Home
          </a>
          <a
            href="#features"
            className="text-gray-800 hover:text-indigo-600 font-semibold transition"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-gray-800 hover:text-indigo-600 font-semibold transition"
          >
            Pricing
          </a>
          <a
            href="#testimonials"
            className="text-gray-800 hover:text-indigo-600 font-semibold transition"
          >
            Testimonials
          </a>

          {/* ✅ Mobile Login + Register */}
          <div className="flex flex-col gap-2 py-4 border-t border-gray-200 md:hidden w-full">
            <button
              onClick={() => navigate("/auth/sign-in")}
              className="text-center text-pink-600 font-bold hover:underline"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/auth/sign-up")}
              className="px-5 py-3 text-center bg-indigo-600 text-white font-bold rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Get Started
            </button>
          </div>
        </nav>

        {/* ✅ Desktop Login + Register */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => navigate("/auth/sign-in")}
            className="text-pink-600 font-bold hover:underline"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/auth/sign-up")}
            className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow hover:bg-indigo-700 transition transform hover:scale-105"
          >
            Get Started
          </button>
        </div>

        {/* Hamburger */}
        <div
          className="md:hidden flex flex-col gap-1 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="w-6 h-0.5 bg-gray-800"></span>
          <span className="w-6 h-0.5 bg-gray-800"></span>
          <span className="w-6 h-0.5 bg-gray-800"></span>
        </div>
      </div>
    </header>
  );
};

export default Header;
