import axiosInstance from "./axiosInstance";

export const getAllOrders = (params) => {
    return axiosInstance.get("/admin/orders", {params});
}

export const getOrderById = (id) => {
    return axiosInstance.get(`/admin/orders/${id}`);
}
