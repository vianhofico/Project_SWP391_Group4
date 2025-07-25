import axiosInstance from "./axiosInstance.js";


export const getAllReports = (params) => {
    return axiosInstance.get(`/reports`, {params})
}

export const createReport = (data) => {
    return axiosInstance.post(`/reports`, data);
}

export const getReportById = (reportId) => {
    return axiosInstance.get(`/reports/${reportId}`);
}

export const checkReport = (reportId, data) => {
    return axiosInstance.put(`/reports/${reportId}`, data);
}