package com.javaweb.services;

import com.javaweb.dtos.request.SearchPostTopicRequest;
import com.javaweb.dtos.response.PostTopicDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostTopicService {

    Page<PostTopicDTO> getAllPostTopics(SearchPostTopicRequest searchPostTopicRequest, Pageable pageable);

    void createPostTopic(PostTopicDTO postTopicDTO);

    void editPostTopic(PostTopicDTO postTopicDTO, Long postTopicId);

    void deletePostTopic(Long postTopicId);

}
