import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, FormGroup, FormControl, FormLabel, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";

export function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.status === 204) {
        toast.error("Sai mật khẩu hoặc email !");
        return;
      }

      if (response.ok) {
        const userData = await response.json();
        sessionStorage.setItem("user", JSON.stringify({
          userId: userData.userId,
          fullName: userData.fullName,
          email: userData.email,
          birthDate: userData.birthDate,
          role: userData.role,
          imageUrl: userData.imageUrl,
          isActive: userData.isActive,
          createdAt: userData.createdAt,
        }));
        toast.success("Đăng nhập thành công!");
        setTimeout(() =>window.location.assign("/"), 2000);
      }
      
      else {
        const errorData = await response.text();
        toast.error(errorData || "Đăng nhập thất bại");
      }
    } catch (err) {
      toast.error("Lỗi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: "Quên Mật Khẩu",
      html: `
        <p class="mb-3">Nhập email của bạn để nhận liên kết đổi mật khẩu.</p>
        <input type="email" id="forgot-email" class="swal2-input" placeholder="name@mail.com">
      `,
      confirmButtonText: "Gửi Email Đổi Mật Khẩu",
      cancelButtonText: "Hủy",
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const email = document.getElementById("forgot-email").value;
        if (!email) {
          Swal.showValidationMessage("Vui lòng nhập email");
        }
        return email;
      },
    });

    if (email) {
      try {
        const response = await fetch(`http://localhost:8081/api/users/forgot-password?email=${email}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          toast.success("Đã gửi email đổi mật khẩu!");
        } else {
          const errorData = await response.text();
          toast.error(errorData || "Có lỗi xảy ra khi gửi email");
        }
      } catch (err) {
        toast.error("Lỗi kết nối đến server");
      }
    }
  };

  return (
    <section className="m-4 d-flex gap-4">
      <div className="w-100 w-lg-50 mt-5">
        <div className="text-center">
          <h2 className="fw-bold mb-4 mt-5">Sign In</h2>
          <p className="text-muted">Enter your email and password to Sign In.</p>
        </div>
        <Form className="mt-4 mx-auto" style={{ maxWidth: "400px" }} onSubmit={handleSubmit}>
          <FormGroup className="mb-3">
            <FormLabel className="fw-medium">Your email</FormLabel>
            <FormControl
              type="email"
              placeholder="name@mail.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <FormLabel className="fw-medium">Password</FormLabel>
            <FormControl
              type="password"
              placeholder="********"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </FormGroup>
          <Button variant="primary" className="w-100 mt-3" type="submit" disabled={loading}>
            {loading && <Spinner animation="border" size="sm" className="me-2" />}
            Sign In
          </Button>
          <div className="d-flex justify-content-between mt-3">
            <FormGroup>
              <Form.Check type="checkbox" id="newsletter" label="Subscribe me to newsletter" disabled={loading} />
            </FormGroup>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-primary text-decoration-underline border-0 bg-transparent"
              disabled={loading}
            >
              Forgot Password
            </button>
          </div>
          <div className="mt-4">
            <Button
              variant="outline-secondary"
              className="w-100 mb-2 d-flex align-items-center justify-content-center"
              disabled={loading}
            >
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1156_824)">
                  <path
                    d="M16.3442 8.18429C16.3442 7.64047 16.3001 7.09371 16.206 6.55872H8.66016V9.63937H12.9813C12.802 10.6329 12.2258 11.5119 11.3822 12.0704V14.0693H13.9602C15.4741 12.6759 16.3442 10.6182 16.3442 8.18429Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M8.65974 16.0006C10.8174 16.0006 12.637 15.2922 13.9627 14.0693L11.3847 12.0704C10.6675 12.5584 9.7415 12.8347 8.66268 12.8347C6.5756 12.8347 4.80598 11.4266 4.17104 9.53357H1.51074V11.5942C2.86882 14.2956 5.63494 16.0006 8.65974 16.0006Z"
                    fill="#34A853"
                  />
                  <path
                    d="M4.16852 9.53356C3.83341 8.53999 3.83341 7.46411 4.16852 6.47054V4.40991H1.51116C0.376489 6.67043 0.376489 9.33367 1.51116 11.5942L4.16852 9.53356Z"
                    fill="#FBBC04"
                  />
                  <path
                    d="M8.65974 3.16644C9.80029 3.1488 10.9026 3.57798 11.7286 4.36578L14.0127 2.08174C12.5664 0.72367 10.6469 -0.0229773 8.65974 0.000539111C5.63494 0.000539111 2.86882 1.70548 1.51074 4.40987L4.1681 6.4705C4.8001 4.57449 6.57266 3.16644 8.65974 3.16644Z"
                    fill="#EA4335"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1156_824">
                    <rect width="16" height="16" fill="white" transform="translate(0.5)" />
                  </clipPath>
                </defs>
              </svg>
              <span className="ms-2">Sign in With Google</span>
            </Button>
          </div>
          <p className="text-center text-muted mt-4">
            Not registered? <Link to="/sign-up" className="text-primary">Create account</Link>
          </p>
        </Form>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} style={{ zIndex: 10000 }} />
      </div>
    </section>
  );
}

export default SignIn;