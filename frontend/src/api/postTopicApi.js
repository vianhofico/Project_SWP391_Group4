import axiosInstance from "./axiosInstance";

export const getAllPostTopics = (params) => {
    return axiosInstance.get("/posttopics", {params});
}

export const addPostTopic = (name) => {
    return axiosInstance.post(`/posttopics`, {name});
}

export const editPostTopic = (topicId, name) => {
    return axiosInstance.put(`/posttopics/${topicId}`, {name});
}