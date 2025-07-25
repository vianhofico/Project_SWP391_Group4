import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export function SignUp() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Password and confirm password do not match.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/api/auth/register", {
                email,
                password,
                confirmPassword,
            });
            console.log("Đăng ký thành công!", response.data);
            navigate("/login");
        } catch (error) {
            console.error("Đăng ký thất bại:", error.response?.data || error.message);
            alert("Đăng ký thất bại: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                minHeight: "100vh",
                fontFamily: "sans-serif",
            }}
        >

            {/* Form side */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "2rem",
                }}
            >
                <div style={{ maxWidth: "500px", width: "100%" }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Join Us Today</h1>
                    <p style={{ fontSize: "1rem", marginBottom: "2rem", color: "#374151" }}>
                        Enter your email and password to register.
                    </p>

                    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Your email</label>
                            <input
                                type="email"
                                placeholder="name@mail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "0.75rem",
                                    fontSize: "1rem",
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Password</label>
                            <input
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "0.75rem",
                                    fontSize: "1rem",
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Confirm password</label>
                            <input
                                type="password"
                                placeholder="********"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "0.75rem",
                                    fontSize: "1rem",
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center" }}>
                            <input type="checkbox" id="agree" required style={{ marginRight: "0.5rem" }} />
                            <label htmlFor="agree" style={{ fontSize: "0.9rem" }}>
                                I agree the{" "}
                                <a href="#" style={{ color: "#000", textDecoration: "underline" }}>
                                    Terms and Conditions
                                </a>
                            </label>
                        </div>

                        <button
                            type="submit"
                            style={{
                                width: "100%",
                                padding: "0.75rem",
                                backgroundColor: "#000",
                                color: "#fff",
                                fontSize: "1rem",
                                fontWeight: "bold",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                            }}
                        >
                            REGISTER NOW
                        </button>

                        <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem", color: "#6B7280" }}>
                            Already have an account?
                            <Link to="/login" style={{ marginLeft: "0.5rem", color: "#111827" }}>
                                Sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
