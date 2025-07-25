import axiosInstance from "@/api/axiosInstance.js";
export const getAllEvents = () => {
    return axiosInstance.get("/admin/discount-events");
}

export const updateEvents = (editingId, eventData) => {
    return axiosInstance.put(`/admin/discount-events/${editingId}`, eventData);
}

export const deleteEvents = (deleteId) => {
    return axiosInstance.delete(`/admin/discount-events/${deleteId}`);
}

export const createEvent = (data) => {
    return axiosInstance.post(`/admin/discount-events`, data);
}

export const getCourses = () => {
    return axiosInstance.get(`/admin/discount-events/courses`);
}

