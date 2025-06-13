package com.javaweb.services.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dtos.request.PostTopicSearchRequest;
import com.javaweb.dtos.response.admin.PostTopicDTO;
import com.javaweb.entities.PostTopic;
import com.javaweb.exceptions.ResourceAlreadyExistsException;
import com.javaweb.exceptions.ResourceNotFoundException;
import com.javaweb.repositories.PostTopicRepository;
import com.javaweb.services.PostTopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostTopicServiceImpl implements PostTopicService {

    private final PostTopicRepository postTopicRepository;
    private final DTOConverter dtoConverter;

    @Override
    public List<PostTopicDTO> getAllPostTopics(PostTopicSearchRequest postTopicSearchRequest) {
        String name = postTopicSearchRequest.name();
        String sortOrder = postTopicSearchRequest.sortOrder();

        if (name == null || name.isBlank()) {
            name = "";
        }

        if (sortOrder == null) {
            sortOrder = "DESC";
        }
        Sort.Direction direction = Sort.Direction.fromString(sortOrder);
        Sort sort = Sort.by(direction, "createdAt");

        List<PostTopic> postTopics = postTopicRepository.findAllPostTopics(name, sort);
        return postTopics.stream().map(dtoConverter::toPostTopicDTO).toList();
    }

    @Override
    public void createPostTopic(PostTopicDTO postTopicDTO) {
        String name = postTopicDTO.getName();
        PostTopic postTopic = postTopicRepository.findByName(name);
        if (postTopic != null) {
            throw new ResourceAlreadyExistsException("Post topic already exists");
        }
        postTopic = PostTopic.builder()
                .name(name)
                .createdAt(LocalDateTime.now())
                .build();
        postTopicRepository.save(postTopic);
    }

    @Override
    public void editPostTopic(PostTopicDTO postTopicDTO, Long postTopicId) {
        String name = postTopicDTO.getName();
        PostTopic postTopic = postTopicRepository.findById(postTopicId).orElseThrow(()
                -> new ResourceNotFoundException("Post topic not found"));
        PostTopic postTopicSameName = postTopicRepository.findByName(name);
        if (postTopicSameName != null) {
            throw new ResourceAlreadyExistsException("Post topic with name: '" + name + "' already exists");
        }
        postTopic.setName(name);
        postTopicRepository.save(postTopic);
    }
}
