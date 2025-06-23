import { useState } from "react";
import axios from "axios";

const useRegisterUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const registerUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, userData);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, error, data };
};

export default useRegisterUser;