import axiosInstance from "@/api/axiosInstance.js";

export const getAllStats = () => {
    return axiosInstance.get("/admin/statistics/course-revenue");
}

export const getMonthlyRevenue = () => {
    return axiosInstance.get("/admin/statistics/monthly-revenue");
}
