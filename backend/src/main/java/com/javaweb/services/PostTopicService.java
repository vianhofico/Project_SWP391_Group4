package com.javaweb.services;

import com.javaweb.dtos.request.PostTopicSearchRequest;
import com.javaweb.dtos.response.PostTopicDTO;

import java.util.List;

public interface PostTopicService {

    List<PostTopicDTO> getAllPostTopics(PostTopicSearchRequest postTopicSearchRequest);

    void createPostTopic(PostTopicDTO postTopicDTO);

    void editPostTopic(PostTopicDTO postTopicDTO, Long postTopicId);
}
