import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export const Navigation = () => {
const navigate = useNavigate();
  const { pathname } = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check user session on mount
  useEffect(() => {
    const checkSession = () => {
      setIsLoggedIn(!!sessionStorage.getItem('user'));
    };

    checkSession();
  }, []);

  // Update cart count on mount and when cart changes
  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      setCartCount(cartItems.length);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const handleLogin = () => navigate('/sign-in');
  const handleRegister = () => navigate('/sign-up');
  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          React Landing Page
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {/* User Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FaUserCircle size={22} />
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                {isLoggedIn ? (
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Đăng xuất
                    </button>
                  </li>
                ) : (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/account">
                        Quản lý tài khoản
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/order-history">
                        Lịch sử mua hàng
                      </Link>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogin}>
                        Đăng nhập
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleRegister}>
                        Đăng kí
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </li>

            {/* Cart */}
            <li className="nav-item position-relative mx-2">
              <Link to="/cart" className="nav-link">
                <FaShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};