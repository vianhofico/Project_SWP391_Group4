package com.javaweb.services.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dtos.request.SearchPostTopicRequest;
import com.javaweb.dtos.response.PostTopicDTO;
import com.javaweb.entities.Post;
import com.javaweb.entities.PostTopic;
import com.javaweb.exceptions.BusinessException;
import com.javaweb.exceptions.ResourceAlreadyExistsException;
import com.javaweb.exceptions.ResourceNotFoundException;
import com.javaweb.repositories.PostRepository;
import com.javaweb.repositories.PostTopicRepository;
import com.javaweb.services.PostTopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostTopicServiceImpl implements PostTopicService {

    private final PostTopicRepository postTopicRepository;
    private final PostRepository postRepository;
    private final DTOConverter dtoConverter;

    @Override
    public Page<PostTopicDTO> getPagePostTopics(SearchPostTopicRequest searchPostTopicRequest, Pageable pageable) {
        String name = searchPostTopicRequest.name();
        String sortOrder = searchPostTopicRequest.sortOrder();

        if (name == null || name.isBlank()) {
            name = "";
        }

        if (sortOrder == null) {
            sortOrder = "DESC";
        }

        Sort.Direction direction = Sort.Direction.fromString(sortOrder);

        pageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(direction, "createdAt")
        );
        Page<PostTopic> postTopics = postTopicRepository.findPagePostTopics(name, pageable);
        return postTopics.map(dtoConverter::toPostTopicDTO);
    }

    @Override
    public List<PostTopicDTO> getAllPostTopics(SearchPostTopicRequest searchPostTopicRequest) {
        String name = searchPostTopicRequest.name();

        if (name == null || name.isBlank()) {
            name = "";
        }

        List<PostTopic> postTopics = postTopicRepository.findAllPostTopics(name);
        return postTopics.stream().map(dtoConverter::toPostTopicDTO).toList();
    }

    @Transactional
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

    @Transactional
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

    @Transactional
    @Override
    public void deletePostTopic(Long postTopicId) {
        PostTopic postTopic = postTopicRepository.findById(postTopicId).orElseThrow(()
                -> new ResourceNotFoundException("Post topic not found"));
        List<Post> posts = postRepository.findByPostTopicPostTopicId(postTopicId);
        if (posts != null && !posts.isEmpty()) {
            throw new BusinessException("Cannot remove this topic because it still contains posts");
        }
        postTopicRepository.delete(postTopic);
    }
}
