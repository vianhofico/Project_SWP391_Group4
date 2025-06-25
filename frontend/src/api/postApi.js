import axiosInstance from "./axiosInstance";

export const getAllPosts = (params) => {
    return axiosInstance.get("/posts", {params});
}

export const getPostById = (postId) => {
    return axiosInstance.get(`/posts/${postId}`);
}

export const getPostComments = (postId, params) => {
    return axiosInstance.get(`/posts/${postId}/comments`, {params});
}
//active or inactive a post
export const activatePost = (postId) => {
    return axiosInstance.put(`/posts/${postId}/activate`);
}

export const getPostsByTopicId = (topicId, params) => {
    return axiosInstance.get(`/posts/topic/${topicId}`, {params});
}

export const createPost = (postData) => {
    return axiosInstance.post(`/posts`, postData);
}

export const deletePost = (postId) => {
    return axiosInstance.delete(`/posts/${postId}`);
}

export const editPost = (postId, postData) => {
    return axiosInstance.put(`/posts/${postId}`, postData);
}