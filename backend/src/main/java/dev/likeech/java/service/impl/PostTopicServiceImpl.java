package dev.likeech.java.service.impl;


import dev.likeech.java.entity.Post;
import dev.likeech.java.entity.PostTopic;
import dev.likeech.java.exp.BusinessException;
import dev.likeech.java.exp.ResourceAlreadyExistsException;
import dev.likeech.java.exp.ResourceNotFoundException;
import dev.likeech.java.mapper.DTOConverter;
import dev.likeech.java.model.dto.PostTopicDTO;
import dev.likeech.java.model.request.SearchPostTopicRequest;
import dev.likeech.java.repository.PostRepository;
import dev.likeech.java.repository.PostTopicRepository;
import dev.likeech.java.service.PostTopicService;
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
