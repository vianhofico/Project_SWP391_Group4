import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import ProfilePopup from "./ProfilePopup";
import "./Navigation.css";

export const Navigation = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const userDropdownRef = useRef(null);

  // Check user session on mount and listen for session changes
  useEffect(() => {
    const checkSession = () => {
      const user = sessionStorage.getItem('user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          setCurrentUser(userData);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setIsLoggedIn(false);
          setCurrentUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    };

    // Check session on mount
    checkSession();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        checkSession();
      }
    };

    // Listen for custom login/logout events
    const handleLoginEvent = () => {
      checkSession();
    };

    const handleLogoutEvent = () => {
      setIsLoggedIn(false);
      setCurrentUser(null);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLogin', handleLoginEvent);
    window.addEventListener('userLogout', handleLogoutEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleLoginEvent);
      window.removeEventListener('userLogout', handleLogoutEvent);
    };
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    setCurrentUser(null);
    setShowProfilePopup(false);
    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new Event('userLogout'));
    navigate('/');
  };

  const handleProfileClick = () => {
    if (currentUser && currentUser.userId) {
      setShowProfilePopup(true);
    }
  };

  const handleHideProfilePopup = () => {
    setShowProfilePopup(false);
  };

  const isActive = (path) => pathname === path;

  return (
    <>
      <nav className="navbar navbar-custom navbar-expand-lg fixed-top">
        <div className="container nav-flex-row">
          {/* Brand Logo */}
          <Link className="navbar-brand nav-brand-bold" to="/">
            REACT LANDING PAGE
          </Link>

          {/* Navigation Menu */}
          <div className="collapse navbar-collapse nav-flex-row" id="navbarNav">
            <ul className="navbar-nav nav-links nav-uppercase">
              <li className="nav-item">
                <Link className={`nav-link nav-link-clean ${isActive('/features') ? 'active' : ''}`} to="/features">FEATURES</Link>
              </li>
            </ul>
            {/* Right Side Actions */}
            <ul className="navbar-nav nav-actions align-items-center">
              {/* User Dropdown/Guest */}
              <li className="nav-item dropdown nav-guest-btn" ref={userDropdownRef}>
                <a
                  className="btn btn-link nav-link nav-link-clean nav-user-btn dropdown-toggle"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ textTransform: "uppercase" }}
                >
                  {isLoggedIn ? (currentUser?.fullName || 'User') : 'Guest'}
                </a>
                <ul className="dropdown-menu dropdown-menu-end custom-dropdown" aria-labelledby="userDropdown">
                  {isLoggedIn ? (
                    <>
                      <li>
                        <button className="dropdown-item" onClick={handleProfileClick}>
                          User Management
                        </button>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/order-history">
                          Shopping History
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item text-danger" onClick={handleLogout}>
                          Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <button className="dropdown-item" onClick={handleLogin}>
                          Login
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={handleRegister}>
                          Register
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </li>
              {/* Cart */}
              <li className="nav-item nav-cart-btn">
                <Link to="/cart" className="nav-link nav-link-clean nav-cart-link">
                  <FaShoppingCart style={{ fontSize: '1.2rem', verticalAlign: 'middle' }} />
                  {cartCount > 0 && (
                    <span className="cart-badge-simple">{cartCount > 99 ? '99+' : cartCount}</span>
                  )}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Profile Popup */}
      {currentUser && (
        <ProfilePopup
          show={showProfilePopup}
          onHide={handleHideProfilePopup}
          userId={currentUser.userId}
        />
      )}

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
};