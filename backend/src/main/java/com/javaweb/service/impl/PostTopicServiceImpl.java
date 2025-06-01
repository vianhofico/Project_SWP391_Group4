package com.javaweb.service.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dto.response.admin.PostTopicDTO;
import com.javaweb.entity.PostTopic;
import com.javaweb.repository.PostTopicRepository;
import com.javaweb.service.PostTopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostTopicServiceImpl implements PostTopicService {

    private final PostTopicRepository postTopicRepository;
    private final DTOConverter dtoConverter;

    @Override
    public List<PostTopicDTO> getAllPostTopics() {
        List<PostTopic> postTopics =  postTopicRepository.findAll();
        return postTopics.stream().map(dtoConverter::toPostTopicDTO).collect(Collectors.toList());
    }
}
