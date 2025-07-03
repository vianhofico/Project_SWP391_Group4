package com.javaweb.services;

import com.javaweb.dtos.request.SearchPostTopicRequest;
import com.javaweb.dtos.response.PostTopicDTO;
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
