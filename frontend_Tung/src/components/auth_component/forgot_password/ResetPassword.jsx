import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Form, Button, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!newPassword) {
    toast.error("Vui lòng nhập mật khẩu mới");
    return;
  }
  try {
    const response = await fetch(
      `http://localhost:8081/api/users/reset-password?token=${token}&newPassword=${encodeURIComponent(newPassword)}`,
      { method: "POST" }
    );
    switch (response.status) {
        case 400:
          toast.error("Yêu cầu không hợp lệ");
          break;
        case 401:
          toast.error("Token không hợp lệ hoặc đã hết hạn");
          break;
        case 500:
          toast.error("Lỗi server, vui lòng thử lại sau");
          break;
        default:
          toast.error("Có lỗi xảy ra khi đặt lại mật khẩu");
      }
    if (response.ok) {
      const message = await response.text();
      toast.success(message || "Đặt lại mật khẩu thành công!");
      setTimeout(() => navigate("/sign-in"), 2000);
    } else {
      
    }
  } catch (err) {
    toast.error("Lỗi kết nối đến server");
  }
};

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-5 pt-3 ">
        <div className="text-center mt-5 ">
          <h2 className="font-bold mb-4 mt-5">Reset password</h2>
          <p className="text-lg font-normal text-blue-gray">
            Nhập mật khẩu mới để đặt lại mật khẩu của bạn.
          </p>
        </div>
        <Form
          className="mt-8 mb-2 mx-auto w-50 max-w-screen-lg lg:w-1/2"
          onSubmit={handleSubmit}
        >
          <Form.Group className="mb-1 flex flex-col gap-6">
            <Form.Label className="font-medium text-blue-gray -mb-3">
              Mật Khẩu Mới
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="********"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            />
          </Form.Group>
          <Button className="mt-6 w-100" type="submit">
            Đặt Lại Mật Khẩu
          </Button>
        </Form>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} style={{ zIndex: 10000 }} />
      </div>
    </section>
  );
}

export default ResetPassword;