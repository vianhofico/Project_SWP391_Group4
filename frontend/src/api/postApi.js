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
export const changePostStatus = (postId) => {
    return axiosInstance.put(`/posts/${postId}`);
}

export const getPostsByTopicId = (topicId, params) => {
    return axiosInstance.get(`/posts/topic/${topicId}`, params);
}