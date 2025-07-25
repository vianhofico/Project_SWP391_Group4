import axiosInstance from "@/api/axiosInstance.js";

export const login = (email, password) => {
    return axiosInstance.post(`/auth/login/admin`, {email, password});
}
