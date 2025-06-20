import { useState, useEffect } from "react";
import axios from "axios";

const useUserProfile = (userId, checkChange) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${userId}`);
      setUser(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi lấy thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId, checkChange]);

  const changePassword = async (userId, passwordData) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/${userId}/change-password`, passwordData);
      return { success: true, message: "Thay đổi mật khẩu thành công!" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Thay đổi mật khẩu thất bại" };
    }
  };

  const removeUser = async (userId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${userId}`);
      return { success: true, message: "User removed successfully!" };
    } catch (error) {
      return { success: false, message: "Error when removing user!" };
    }
  };

  const updateProfile = async (userId, data) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${userId}/profile`, data);
      return { success: true, message: "Cập nhật thông tin thành công!" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Cập nhật thông tin thất bại" };
    }
  };

  return { user, loading, error, refetch: fetchUser, changePassword, removeUser, updateProfile };
};

export default useUserProfile;