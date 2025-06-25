import axiosInstance from "@/api/axiosInstance.js";

export const createComment = (postId, commentData) => {
    return axiosInstance.post(`/comments/${postId}`, commentData);
}

export const editComment = (commentId, commentData) => {
    return axiosInstance.put(`/comments/${commentId}`, commentData);
}

export const deleteComment = (commentId) => {
    return axiosInstance.delete(`/comments/${commentId}`);
}

export const activateComment = (commentId) => {
    return axiosInstance.put(`/comments/${commentId}/activate`);
}