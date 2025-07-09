// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
//
// const SignIn = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const navigate = useNavigate();
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//
//         try {
//             const response = await axios.post('http://localhost:8080/api/auth/login', {
//                 email,
//                 password,
//             });
//
//             // Giả sử server trả về token
//             const token = response.data.token;
//             localStorage.setItem('token', token);
//             window.dispatchEvent(new Event("loginSuccess")); // thông báo toàn bộ app
//
//             // Có thể lưu thêm thông tin user nếu muốn
//             // localStorage.setItem('user', JSON.stringify(response.data.user));
//
//             navigate('/'); // chuyển về trang chủ
//         } catch (err) {
//             setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
//         }
//     };
//
//     return (
//         <div className="container mt-5 pt-5" style={{ maxWidth: '500px' }}>
//             <h2 className="mb-4">Đăng nhập</h2>
//             {error && <div className="alert alert-danger">{error}</div>}
//             <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                     <label className="form-label">Email</label>
//                     <input
//                         type="email"
//                         className="form-control"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                     />
//                 </div>
//
//                 <div className="mb-3">
//                     <label className="form-label">Mật khẩu</label>
//                     <input
//                         type="password"
//                         className="form-control"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                     />
//                 </div>
//
//                 <button type="submit" className="btn btn-primary w-100">
//                     Đăng nhập
//                 </button>
//             </form>
//         </div>
//     );
// };
//
// export default SignIn;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email,
                password,
            });
            const { token, user } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            // window.dispatchEvent(new Event("authChanged"));
            window.dispatchEvent(new Event("loginSuccess"));


            navigate("/");


            console.log("Đăng nhập thành công!");
        } catch (error) {
            console.error("Đăng nhập thất bại:", error.response?.data || error.message);
            alert("Email hoặc mật khẩu không đúng!");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
                <div className="col-md-6">
                    <div className="card shadow-sm p-4">
                        <h3 className="text-center mb-4">Đăng nhập</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Nhập email của bạn"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Mật khẩu</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-check mb-3">
                                <input type="checkbox" className="form-check-input" id="remember" />
                                <label className="form-check-label" htmlFor="remember">
                                    Ghi nhớ đăng nhập
                                </label>
                            </div>

                            <button type="submit" className="btn btn-primary w-100">
                                Đăng nhập
                            </button>

                            <div className="d-flex justify-content-between mt-3">
                                <Link to="/forgot-password">Quên mật khẩu?</Link>
                                <Link to="/auth/sign-up">Chưa có tài khoản?</Link>
                            </div>
                        </form>

                        <div className="mt-4 text-center">
                            <button className="btn btn-outline-dark w-100" type="button">
                                <img
                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                    alt="Google"
                                    style={{ width: "20px", marginRight: "10px" }}
                                />
                                Đăng nhập với Google
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 d-none d-md-block">
                    <img
                        src="/img/pattern.png"
                        alt="Pattern"
                        className="img-fluid rounded shadow"
                        style={{ maxHeight: "80vh", objectFit: "cover" }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SignIn;
