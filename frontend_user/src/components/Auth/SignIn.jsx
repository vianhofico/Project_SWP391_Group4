import React, { useState } from "react";
import { Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../../lib/axiosConfig";

export function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Đăng nhập thành công!");

      // 👉 Điều hướng sang trang chính hoặc dashboard tùy bạn tự xử lý ở route
      navigate("/");
    } catch (error) {
      console.error(
        "Đăng nhập thất bại:",
        error.response?.data || error.message
      );
      alert("Email hoặc mật khẩu không đúng!");
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            Sign In
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            Enter your email and password to Sign In.
          </Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-3 font-medium"
            >
              Your email
            </Typography>
            <Input
              onChange={(e) => setEmail(e.target.value)}
              size="lg"
              placeholder="name@mail.com"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-3 font-medium"
            >
              Password
            </Typography>
            <Input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              size="lg"
              placeholder="********"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                I agree the&nbsp;
                <a
                  href="#"
                  className="font-normal text-black hover:text-gray-900 underline"
                >
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          <Button onClick={handleSubmit} className="mt-6" fullWidth>
            Sign In
          </Button>

          <div className="flex items-center justify-between gap-2 mt-6">
            <div></div>
            <Typography variant="small" className="font-medium text-gray-900">
              <a href="#">Forgot Password</a>
            </Typography>
          </div>
          <div className="space-y-4 mt-8">
            <Button
              size="lg"
              color="white"
              className="flex items-center gap-2 justify-center shadow-md"
              fullWidth
            >
              <img src="/img/google.svg" alt="google" className="h-5 w-5" />
              <span>Sign in With Google</span>
            </Button>
          </div>
          <Typography
            variant="paragraph"
            className="text-center text-blue-gray-500 font-medium mt-4"
          >
            Not registered?
            <Link to="/auth/sign-up" className="text-gray-900 ml-1">
              Create account
            </Link>
          </Typography>
        </form>
      </div>

      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
    </section>
  );
}

export default SignIn;
