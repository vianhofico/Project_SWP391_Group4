import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import useRegisterUser from "./useRegisterUser";

export function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    birthDate: "",
    imageUrl: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { registerUser, loading, error } = useRegisterUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast.error("Vui lòng đồng ý với Điều khoản và Điều kiện");
      return;
    }
    try {
      await registerUser({ ...formData, role: "USER" });
      toast.success("Đăng ký thành công!");
      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
    } catch (err) {
      toast.error(error || "Đăng ký thất bại, đã có data tồn tại trong hệ thống");
    }
  };

  return (
    <Container fluid className="pt-5 mt-5">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col lg={6} className="d-flex flex-column align-items-center">
          <div className="text-center mb-4">
            <h2 className="fw-bold">Join Us Today</h2>
            <p className="text-muted">Enter your email and password to register.</p>
          </div>
          <Form className="w-100 w-lg-75" onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tran My Linh"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="border-top border-2"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Your email</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@mail.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border-top border-2"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="********"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="border-top border-2"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Birth Date</Form.Label>
              <Form.Control
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="border-top border-2"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="https://example.com/avatar.jpg"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="border-top border-2"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label={
                  <span>
                    I agree the{" "}
                    <a href="#" className="text-dark text-decoration-underline">
                      Terms and Conditions
                    </a>
                  </span>
                }
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-3"
              disabled={loading}
            >
              {loading ? "Đang đăng ký..." : "Register Now"}
            </Button>

            <div className="mt-4">
              <Button
                variant="outline-secondary"
                className="w-100 d-flex align-items-center justify-content-center mb-3"
              >
                <svg
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
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
                      <rect
                        width="16"
                        height="16"
                        fill="white"
                        transform="translate(0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <span className="ms-2">Sign in With Google</span>
              </Button>
            </div>
            <p className="text-center text-muted mt-4">
              Already have an account?{" "}
              <Link to="/sign-in" className="text-dark">
                Sign in
              </Link>
            </p>
          </Form>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </Col>
      </Row>
    </Container>
  );
}

export default SignUp;