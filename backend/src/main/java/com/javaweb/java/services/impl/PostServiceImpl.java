package com.javaweb.java.services.impl;

import com.fasterxml.jackson.core.JsonProcessingException;

import com.javaweb.java.entities.Post;
import com.javaweb.java.entities.PostTopic;
import com.javaweb.java.entities.User;
import com.javaweb.java.enums.Status;
import com.javaweb.java.exceptions.AccessDeniedException;
import com.javaweb.java.exceptions.BusinessException;
import com.javaweb.java.exceptions.ResourceNotFoundException;
import com.javaweb.java.converter.DTOConverter;
import com.javaweb.java.dtos.response.PostDTO;
import com.javaweb.java.dtos.request.PostRequest;
import com.javaweb.java.dtos.request.SearchPostRequest;
import com.javaweb.java.repositories.PostFileRepository;
import com.javaweb.java.repositories.PostRepository;
import com.javaweb.java.repositories.PostTopicRepository;
import com.javaweb.java.repositories.UserRepository;
import com.javaweb.java.security.utils.SecurityUtils;
import com.javaweb.java.services.CloudinaryService;
import com.javaweb.java.services.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
public class PostServiceImpl implements PostService {

    private final CloudinaryService cloudinaryService;
    private final PostRepository postRepository;
    private final DTOConverter dtoConverter;
    private final UserRepository userRepository;
    private final PostTopicRepository postTopicRepository;
    private final PostFileRepository postFileRepository;

    @Override
    public Page<PostDTO> getAllPostsOfUser(Long userId, Pageable pageable) {
        Page<Post> pagePosts = postRepository.findByUserUserId(userId, pageable);
        return pagePosts.map(dtoConverter::toAdminPostDTO);
    }

    @Override
    public Page<PostDTO> getAllPosts(SearchPostRequest searchPostRequest, Pageable pageable) {
        String sortOrderRaw = searchPostRequest.sortOrder();
        String titleRaw = searchPostRequest.title();
        String postTopicIdRaw = searchPostRequest.postTopicId();
        String statusRaw = searchPostRequest.status();

        String sortOrder = (sortOrderRaw == null) ? "DESC" : sortOrderRaw.toUpperCase();
        String title = (titleRaw == null || titleRaw.isBlank()) ? "" : titleRaw;
        Long postTopicId = (postTopicIdRaw == null || postTopicIdRaw.isBlank()) ? null : Long.parseLong(postTopicIdRaw);
        String status = (statusRaw == null) ? "ACTIVE" : statusRaw;

        if (SecurityUtils.getCurrentUserEmail() == null || SecurityUtils.hasRole("ROLE_LEARNER")) {
            status = "ACTIVE";
        }

        Sort.Direction direction = Sort.Direction.fromString(sortOrder);

        pageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(direction, "createdAt")
        );

        Page<Post> pagePosts = postRepository.findAllPosts(title, postTopicId, status, pageable);
        return pagePosts.map(dtoConverter::toPostDTO);
    }


    @Override // only for learner
    public Page<PostDTO> getAllPostsByTopicId(Long postTopicId, Pageable pageable, SearchPostRequest searchPostRequest) {
        String sortOrderRaw = searchPostRequest.sortOrder();
        String titleRaw = searchPostRequest.title();

        String sortOrder = (sortOrderRaw == null || sortOrderRaw.isBlank()) ? "DESC" : sortOrderRaw.toUpperCase();
        String title = (titleRaw == null || titleRaw.isBlank()) ? "" : titleRaw;
        String status = "ACTIVE";

        Sort.Direction direction = Sort.Direction.fromString(sortOrder);

        pageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(direction, "createdAt")
        );

        Page<Post> pagePosts = postRepository.findAllPostByPostTopicId(title, postTopicId, status, pageable);
        return pagePosts.map(dtoConverter::toPostDTO);
    }

    @Transactional
    @Override
    public void changeStatus(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Cannot find Post with id: " + postId));

        String currentUserEmail = SecurityUtils.getCurrentUserEmail();

        if (currentUserEmail == null || (!currentUserEmail.equals(post.getUser().getEmail()) && !SecurityUtils.hasRole("ROLE_ADMIN"))) {
            throw new AccessDeniedException("No access");
        }

        if (post.getStatus().equalsIgnoreCase("ACTIVE")) {
            post.setStatus(Status.DELETED.getValue());
        } else if (post.getStatus().equalsIgnoreCase("DELETED")) {
            post.setStatus(Status.ACTIVE.getValue());
        }
        postRepository.save(post);
    }

    @Override
    public PostDTO getPostById(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Cannot find Post with id: " + postId));
        return dtoConverter.toAdminPostDTO(post);
    }

    @Transactional
    @Override
    public void createPost(PostRequest postRequest, List<MultipartFile> files) throws JsonProcessingException, IOException {
        String currentUserEmail = SecurityUtils.getCurrentUserEmail();
        User currentUser = userRepository.findByEmail(currentUserEmail).orElseThrow(
                () -> new ResourceNotFoundException("Cannot find User with email: " + currentUserEmail));

        Long postTopicId = postRequest.postTopicId();
        PostTopic postTopic = postTopicRepository.findById(postTopicId).orElseThrow(
                () -> new ResourceNotFoundException("Cannot find Post Topic"));

        String title = postRequest.title();
        String content = postRequest.content();
        LocalDateTime now = LocalDateTime.now();

        Post post = Post
                .builder()
                .title(title)
                .content(content)
                .createdAt(now)
                .user(currentUser)
                .postTopic(postTopic)
                .status(Status.ACTIVE.getValue())
                .build();
        postRepository.save(post);

        if (files != null && !files.isEmpty()) {
            cloudinaryService.uploadFilesKafka(files, post.getPostId());
        }
    }

    @Transactional
    @Override
    public void updatePost(Long postId, PostRequest postRequest, List<MultipartFile> files, List<Long> removedFileIds) throws JsonProcessingException, IOException {
        Post thisPost = postRepository.findById(postId).orElseThrow(
                () -> new ResourceNotFoundException("Cannot find Post with id: " + postId));

        String currentUserEmail = SecurityUtils.getCurrentUserEmail();
        if (!thisPost.getUser().getEmail().equals(currentUserEmail)) {
            throw new BusinessException("You cannot edit this post");
        }

        // post được sửa trong vòng 1h
        Duration duration = Duration.between(thisPost.getCreatedAt(), LocalDateTime.now());
        if (duration.toMinutes() > 60) {
            throw new BusinessException("Post can only be edited within 1 hour");
        }

        String newTitle = postRequest.title();
        String newContent = postRequest.content();
        Long currentPostTopicId = thisPost.getPostTopic().getPostTopicId();
        Long newPostTopicId = postRequest.postTopicId();
        if (!newPostTopicId.equals(currentPostTopicId)) {
            PostTopic postTopic = postTopicRepository.findById(newPostTopicId).orElseThrow(
                    () -> new ResourceNotFoundException("Cannot find new Post Topic"));
            thisPost.setPostTopic(postTopic);
        }
        thisPost.setTitle(newTitle);
        thisPost.setContent(newContent);
        postRepository.save(thisPost);

        if (removedFileIds != null && !removedFileIds.isEmpty()) {
            postFileRepository.detachPostFromFiles(removedFileIds);
        }

        if (files != null && !files.isEmpty()) {
            cloudinaryService.uploadFilesKafka(files, postId);
        }
    }

}
