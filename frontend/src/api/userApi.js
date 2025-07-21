import axiosInstance from "./axiosInstance";

export const getAllAdmins = (params) => {
    return axiosInstance.get("/users/admins", {params});
};

export const getUserById = (userId) => {
    return axiosInstance.get(`/users/${userId}`);
};

export const getAllUsers = (params) => {//learner or admin
    return axiosInstance.get(`/users/${params.role}s`, {params});
};

export const resetPassword = (to) => {
    return axiosInstance.put(`/users/reset-password`, {to})
}

export const getTabFromUser = (userId, tab) => {
    return axiosInstance.get(`/users/${userId}/${tab}`);
}

export const addAdmin = (email) => {
    return axiosInstance.post(`/users/add-admin`, {email});
}