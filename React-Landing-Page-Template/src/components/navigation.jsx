import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from "axios";

export const Navigation = () => {
    const [cartCount, setCartCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setUserName("");
                return;
            }

            const res = await axios.get("http://localhost:8080/api/users/account/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

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
                headers: { Authorization: `Bearer ${token}` }
            });
            const cartItems = cartRes.data || [];
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            setCartCount(cartItems.length);
        } catch (err) {
            console.error("Lỗi khi lấy giỏ hàng:", err);
        }
    }

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
            setIsLoggedIn(!!localStorage.getItem("token"));
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

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
            <div className="container d-flex justify-content-between align-items-center">
                <Link className="navbar-brand fw-bold text-primary" to="/">
                    SWP TEAM
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav align-items-center">
                        {!isLoggedIn ? (
                            <li className="nav-item">
                                <Link to="/login" className="nav-link fw-semibold text-primary">Đăng nhập</Link>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item dropdown d-flex align-items-center me-3">
                                    <a
                                        className="nav-link dropdown-toggle d-flex align-items-center bg-light rounded-pill px-3 py-1"
                                        href="#"
                                        id="userDropdown"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        style={{
                                            border: "1px solid #dee2e6",
                                            height: "42px",
                                            fontSize: "1rem"
                                        }}
                                    >
                                        <FaUserCircle className="me-2" size={20} />
                                        <span className="text-primary fw-medium">Xin chào, {userName}</span>
                                    </a>

                                    <div className="dropdown-menu dropdown-menu-end p-4 shadow"
                                         style={{ width: '400px', borderRadius: '15px', fontSize: "1rem" }}>
                                        <h6 className="fw-bold mb-3 text-uppercase text-muted">Góc học tập</h6>
                                        <div className="row">
                                            <div className="col-6">
                                                <Link to="/account-settings" className="dropdown-item px-0 py-2">Quản lý tài khoản</Link>
                                                <Link to="/my-courses" className="dropdown-item px-0 py-2">Khóa học của tôi</Link>
                                                <Link to="/order-history" className="dropdown-item px-0 py-2">Lịch sử mua hàng</Link>
                                            </div>
                                            <div className="col-6">
                                                <Link to="/quizzes" className="dropdown-item px-0 py-2">Làm Quiz</Link>
                                                <Link to="/assignments" className="dropdown-item px-0 py-2">Bài tập</Link>
                                                <Link to="/assignments" className="dropdown-item px-0 py-2">Chat</Link>
                                            </div>
                                        </div>
                                        <hr className="my-3" />
                                        <div className="d-flex justify-content-end">
                                            <button onClick={handleLogout} className="btn btn-link text-danger p-0">
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </li>

                                <li className="nav-item position-relative d-flex align-items-center">
                                    <Link to="/cart" className="nav-link d-flex align-items-center">
                                        <FaShoppingCart size={24} />
                                        <span
                                            className="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-danger"
                                            style={{ fontSize: '0.75rem' }}
                                        >
                                            {cartCount}
                                        </span>
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};
