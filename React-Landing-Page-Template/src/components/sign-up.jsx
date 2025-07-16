import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export function SignUp() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try{
    //         const register = await axios.post('http://localhost:8080/api/auth/register',
    //             {email, password, confirmPassword});
    //
    //         console.log("Đăng ký thành công!");
    //         navigate("/sign-in");
    //     } catch (error) {
    //         console.error("Đăng ký thất bại:", error.response?.data || error.message);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra password khớp nhau
        if (password !== confirmPassword) {
            alert("Password and confirm password do not match.");
            return;
        }

        try {
            console.log("Gửi dữ liệu đăng ký:", { email, password, confirmPassword });

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
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            fontFamily: 'sans-serif',
        }}>
            {/* Image side */}
            <div style={{
                flex: '1',
                backgroundImage: 'url("/img/pattern.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '16px',
                margin: '2rem',
                display: 'none',
            }} className="lg-show" />

            <div className="col-md-6 d-none d-md-block">
                <img
                    src="/img/pattern.png"
                    alt="Pattern"
                    className="img-fluid rounded shadow"
                    style={{ maxHeight: "80vh", objectFit: "cover" }}
                />
            </div>

            {/* Form side */}
            <div style={{
                flex: '1',
                maxWidth: '600px',
                margin: 'auto',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Join Us Today</h1>
                <p style={{ fontSize: '1rem', marginBottom: '2rem', color: '#374151' }}>
                    Enter your email and password to register.
                </p>

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Your email</label>
                        <input
                            type="email"
                            placeholder="name@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                fontSize: '1rem',
                                border: '1px solid #ccc',
                                borderRadius: '8px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
                        <input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                fontSize: '1rem',
                                border: '1px solid #ccc',
                                borderRadius: '8px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Confirm password</label>
                        <input
                            type="password"
                            placeholder="********"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                fontSize: '1rem',
                                border: '1px solid #ccc',
                                borderRadius: '8px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                        <input type="checkbox" id="agree" required style={{ marginRight: '0.5rem' }} />
                        <label htmlFor="agree" style={{ fontSize: '0.9rem' }}>
                            I agree the&nbsp;
                            <a href="#" style={{ color: '#000', textDecoration: 'underline' }}>Terms and Conditions</a>
                        </label>
                    </div>

                    <button type="submit" style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#000',
                        color: '#fff',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}>
                        REGISTER NOW
                    </button>

                    <div style={{ marginTop: '2rem' }}>
                        <button type="button" style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontSize: '1rem',
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer'
                        }}>
                            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0)">
                                    <path d="M16.3442 8.18429C16.3442 7.64047 16.3001 7.09371 16.206 6.55872H8.66016V9.63937H12.9813C12.802 10.6329 12.2258 11.5119 11.3822 12.0704V14.0693H13.9602C15.4741 12.6759 16.3442 10.6182 16.3442 8.18429Z" fill="#4285F4" />
                                    <path d="M8.65974 16.0006C10.8174 16.0006 12.637 15.2922 13.9627 14.0693L11.3847 12.0704C10.6675 12.5584 9.7415 12.8347 8.66268 12.8347C6.5756 12.8347 4.80598 11.4266 4.17104 9.53357H1.51074V11.5942C2.86882 14.2956 5.63494 16.0006 8.65974 16.0006Z" fill="#34A853" />
                                    <path d="M4.16852 9.53356C3.83341 8.53999 3.83341 7.46411 4.16852 6.47054V4.40991H1.51116C0.376489 6.67043 0.376489 9.33367 1.51116 11.5942L4.16852 9.53356Z" fill="#FBBC04" />
                                    <path d="M8.65974 3.16644C9.80029 3.1488 10.9026 3.57798 11.7286 4.36578L14.0127 2.08174C12.5664 0.72367 10.6469 -0.0229773 8.65974 0.000539111C5.63494 0.000539111 2.86882 1.70548 1.51074 4.40987L4.1681 6.4705C4.8001 4.57449 6.57266 3.16644 8.65974 3.16644Z" fill="#EA4335" />
                                </g>
                                <defs>
                                    <clipPath id="clip0">
                                        <rect width="16" height="16" fill="white" transform="translate(0.5)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <span>Sign in with Google</span>
                        </button>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#6B7280' }}>
                        Already have an account?
                        <Link to="/login" style={{ marginLeft: '0.5rem', color: '#111827' }}>Sign in</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
