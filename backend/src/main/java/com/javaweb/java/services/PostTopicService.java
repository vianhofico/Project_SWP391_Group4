package com.javaweb.java.services;


import com.javaweb.java.dtos.response.PostTopicDTO;
import com.javaweb.java.dtos.request.SearchPostTopicRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PostTopicService {

    Page<PostTopicDTO> getPagePostTopics(SearchPostTopicRequest searchPostTopicRequest, Pageable pageable);

    List<PostTopicDTO> getAllPostTopics(SearchPostTopicRequest searchPostTopicRequest);

    void createPostTopic(PostTopicDTO postTopicDTO);

    void editPostTopic(PostTopicDTO postTopicDTO, Long postTopicId);

    void deletePostTopic(Long postTopicId);

}
