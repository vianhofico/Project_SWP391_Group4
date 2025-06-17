import axiosInstance from "@/api/axiosInstance.js";

export const getAllReports = (params) => {
    return axiosInstance.get(`/reports`, {params})
}