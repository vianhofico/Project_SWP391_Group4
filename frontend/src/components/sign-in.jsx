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
            const response = await axios.post("http://localhost:8080/api/auth/login", {
                email,
                password,
            });
            const { token, user } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            window.dispatchEvent(new Event("loginSuccess"));
            navigate("/");
        } catch (error) {
            alert("Email hoặc mật khẩu không đúng!");
        }
    };

    return (
        <div className="container-fluid" style={{ minHeight: "100vh" }}>
            <div className="row align-items-center" style={{ minHeight: "100vh" }}>
                {/* Left side: Form */}
                <div className="col-md-6 px-5">
                    <div className="mx-auto" style={{ maxWidth: "400px" }}>
                        <h2 className="fw-bold text-center mb-3">Sign In</h2>
                        <p className="text-center mb-4 text-muted">Enter your email and password to Sign In.</p>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Your email</label>
                                <input
                                    type="email"
                                    className="form-control form-control-lg"
                                    placeholder="name@mail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control form-control-lg"
                                    placeholder="********"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-check mb-3">
                                <input className="form-check-input" type="checkbox" id="terms" />
                                <label className="form-check-label" htmlFor="terms">
                                    I agree the <Link to="#">Terms and Conditions</Link>
                                </label>
                            </div>

                            <button type="submit" className="btn btn-dark w-100 py-2 fw-bold">
                                SIGN IN
                            </button>

                            <div className="text-end mt-2">
                                <Link to="/forgot-password" className="text-muted">Forgot Password</Link>
                            </div>
                        </form>

                        <div className="mt-4">
                            <button className="btn btn-light border w-100 py-2 d-flex align-items-center justify-content-center">
                                <img
                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                    alt="Google"
                                    style={{ width: "20px", marginRight: "10px" }}
                                />
                                SIGN IN WITH GOOGLE
                            </button>
                        </div>

                        <div className="text-center mt-4">
                            <span className="text-muted">Not registered? </span>
                            <Link to="/sign-up" className="fw-bold text-decoration-none">Create account</Link>
                        </div>
                    </div>
                </div>

                {/* Right side: Image */}
                <div className="col-md-6 d-none d-md-block">
                    <img
                        src="/img/pattern.png"
                        alt="Background"
                        className="img-fluid"
                        style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100vh",
                            borderTopLeftRadius: "2rem",
                            borderBottomLeftRadius: "2rem",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SignIn;
