import axiosInstance from "@/api/axiosInstance.js";

export const login = (email, password) => {
    return axiosInstance.post(`/auth/login`, {email, password});
}

export const register = (email, password, confirmPassword) => {
    return axiosInstance.post(`/auth/register`, {email, password, confirmPassword});
}