package com.javaweb.services;

import com.javaweb.dtos.request.PostTopicSearchRequest;
import com.javaweb.dtos.response.admin.PostTopicDTO;

import java.util.List;

public interface PostTopicService {

    List<PostTopicDTO> getAllPostTopics(PostTopicSearchRequest postTopicSearchRequest);

}
