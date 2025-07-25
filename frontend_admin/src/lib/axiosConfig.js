// src/lib/axiosConfig.js
import axios from "axios";

// Lấy biến môi trường
const API_ADDRESS = import.meta.env.VITE_API_ADDRESS;
console.log("🌐 API base URL:", API_ADDRESS);

// Hàm lấy access token từ localStorage
const getAccessToken = () => localStorage.getItem("accessToken");

// Tạo apiClient
export const apiClient = axios.create({
  baseURL: API_ADDRESS,
  timeout: 5000,
});

// 👉 Thêm interceptor để tự động gắn Authorization nếu có token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("🚫 Token chưa được thiết lập");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
