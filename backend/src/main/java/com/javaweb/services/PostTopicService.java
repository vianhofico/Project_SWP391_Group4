package com.javaweb.services;

import com.javaweb.dtos.request.SearchPostTopicRequest;
import com.javaweb.dtos.response.PostTopicDTO;

import java.util.List;

public interface PostTopicService {

    List<PostTopicDTO> getAllPostTopics(SearchPostTopicRequest searchPostTopicRequest);

    void createPostTopic(PostTopicDTO postTopicDTO);

    void editPostTopic(PostTopicDTO postTopicDTO, Long postTopicId);

    void deletePostTopic(Long postTopicId);

}
