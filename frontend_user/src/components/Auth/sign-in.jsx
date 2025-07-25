import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
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
            const {token, user} = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            window.dispatchEvent(new Event("loginSuccess"));
            navigate("/");
        } catch (error) {
            alert("Email hoặc mật khẩu không đúng!");
        }
    };

    return (
        <div className="container-fluid d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
            <div className="row w-100 justify-content-center">
                {/* Left side: Form */}
                <div className="col-12 col-md-6 col-lg-4 px-4">
                    <div className="mx-auto">
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
                                <input className="form-check-input" type="checkbox" id="terms"/>
                                <label className="form-check-label" htmlFor="terms">
                                    I agree the <Link to="#">Terms and Conditions</Link>
                                </label>
                            </div>

                            <button type="submit" className="btn btn-dark w-100 py-2 fw-bold">
                                SIGN IN
                            </button>

                            <div className="text-end mt-2">
                                <Link to="/forgot-password" className="text-muted">
                                    Forgot Password
                                </Link>
                            </div>
                        </form>

                        <div className="text-center mt-4">
                            <span className="text-muted">Not registered? </span>
                            <Link to="/sign-up" className="fw-bold text-decoration-none">
                                Create account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
