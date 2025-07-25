import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaUserCircle, FaHome, FaBook, FaComments, FaInfoCircle, FaPhone } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import axios from "axios";

export const Navigation = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserName("");
        return;
      }

      const res = await axios.get(
          "http://localhost:8080/api/users/account/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );

      setUserName(res.data.email);
      // setUserName(res.data.fullName);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      setUserName("");
    }
  };

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const cartRes = await axios.get("http://localhost:8080/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cartItems = cartRes.data || [];
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      setCartCount(cartItems.length);
    } catch (err) {
      console.error("Lỗi khi lấy giỏ hàng:", err);
    }
  };

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    const stored = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCartCount(stored.length);
    fetchUser();
  }, []);

  useEffect(() => {
    const handleLoginOrCartUpdate = () => {
      const stored = JSON.parse(localStorage.getItem("cartItems") || "[]");
      setCartCount(stored.length);
      setIsLoggedIn(localStorage.getItem("token"));
      fetchUser();
    };

    window.addEventListener("loginSuccess", () => {
      handleLoginOrCartUpdate();
      fetchCart(); // Load cart mới khi đăng nhập
    });
    window.addEventListener("logout", handleLoginOrCartUpdate);
    window.addEventListener("cartUpdated", handleLoginOrCartUpdate);
    window.addEventListener("storage", handleLoginOrCartUpdate);

    return () => {
      window.removeEventListener("loginSuccess", handleLoginOrCartUpdate);
      window.removeEventListener("logout", handleLoginOrCartUpdate);
      window.removeEventListener("cartUpdated", handleLoginOrCartUpdate);
      window.removeEventListener("storage", handleLoginOrCartUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cartItems"); // Xóa cart cũ khi logout
    window.dispatchEvent(new Event("logout"));
    navigate("/");
  };

  // Kiểm tra xem link có active không
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
      <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold text-primary fs-3" to="/">
            <span className="text-gradient">G4 Course</span>
          </Link>

          <button
              className="navbar-toggler border-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            {/* Navigation Menu */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                    className={`nav-link px-3 fw-medium ${isActiveLink('/') ? 'active text-primary' : 'text-dark'}`}
                    to="/"
                >
                  <FaHome className="me-1" />
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                    className={`nav-link px-3 fw-medium ${isActiveLink('/courses') ? 'active text-primary' : 'text-dark'}`}
                    to="/courses"
                >
                  <FaBook className="me-1" />
                  Courses
                </Link>
              </li>
              <li className="nav-item">
                <Link
                    className={`nav-link px-3 fw-medium position-relative ${isActiveLink('/forum') ? 'active text-primary' : 'text-dark'}`}
                    to="/forum"
                >
                  <FaComments className="me-1" />
                  Forum
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.6rem'}}>
                  New
                </span>
                </Link>
              </li>
            </ul>

            {/* User Actions */}
            <ul className="navbar-nav ms-auto align-items-center">
              {!isLoggedIn ? (
                  <>
                    <li className="nav-item me-2">
                      <Link to="/sign-up" className="nav-link fw-medium text-dark">
                        Register
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/login" className="btn btn-primary px-4 fw-medium">
                        Login
                      </Link>
                    </li>
                  </>
              ) : (
                  <>
                    {/* Cart */}
                    <li className="nav-item position-relative me-3">
                      <Link
                          to="/cart"
                          className="nav-link d-flex align-items-center p-2 rounded-circle bg-light"
                          title="Shopping Cart"
                      >
                        <FaShoppingCart size={20} className="text-primary" />
                        {cartCount > 0 && (
                            <span
                                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                style={{ fontSize: "0.7rem" }}
                            >
                        {cartCount}
                      </span>
                        )}
                      </Link>
                    </li>

                    {/* User Dropdown */}
                    <li className="nav-item dropdown">
                      <button
                          className="btn btn-outline-primary dropdown-toggle d-flex align-items-center px-3 py-2"
                          type="button"
                          id="userDropdown"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                      >
                        <FaUserCircle className="me-2" size={18} />
                        <span className="d-none d-md-inline">Hello, {userName}</span>
                        <span className="d-md-none">Menu</span>
                      </button>

                      <div
                          className="dropdown-menu dropdown-menu-end p-3 shadow border-0"
                          style={{
                            width: "320px",
                            borderRadius: "12px",
                            fontSize: "0.95rem",
                          }}
                      >
                        <h6 className="fw-bold mb-3 text-uppercase text-muted small">
                          Account
                        </h6>
                        <div className="row g-2">
                          <div className="col-12">
                            <Link
                                to="/account-settings"
                                className="dropdown-item px-3 py-2 rounded"
                            >
                              <FaUserCircle className="me-2" />
                              My Profile
                            </Link>
                            <Link
                                to="/my-courses"
                                className="dropdown-item px-3 py-2 rounded"
                            >
                              <FaBook className="me-2" />
                              My Courses
                            </Link>
                            <Link
                                to="/order-history"
                                className="dropdown-item px-3 py-2 rounded"
                            >
                              <FaShoppingCart className="me-2" />
                              Order History
                            </Link>
                          </div>
                        </div>
                        <hr className="my-3" />
                        <div className="d-flex justify-content-end">
                          <button
                              onClick={handleLogout}
                              className="btn btn-outline-danger btn-sm px-3"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    </li>
                  </>
              )}
            </ul>
          </div>
        </div>

        <style jsx>{`
        .text-gradient {
          background: linear-gradient(45deg, #007bff, #6f42c1);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .nav-link:hover {
          transform: translateY(-1px);
          transition: all 0.2s ease;
        }
        
        .nav-link.active {
          font-weight: 600 !important;
        }
        
        .dropdown-item:hover {
          background-color: #f8f9fa;
          transform: translateX(4px);
          transition: all 0.2s ease;
        }
        
        @media (max-width: 991px) {
          .navbar-nav {
            padding: 1rem 0;
          }
          
          .nav-item {
            margin: 0.2rem 0;
          }
        }
      `}</style>
      </nav>
  );
};