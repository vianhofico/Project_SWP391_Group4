package com.javaweb.services.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dtos.request.PostRequest;
import com.javaweb.dtos.request.SearchPostRequest;
import com.javaweb.dtos.response.PostDTO;
import com.javaweb.entities.Post;
import com.javaweb.entities.PostTopic;
import com.javaweb.entities.User;
import com.javaweb.enums.PostStatus;
import com.javaweb.exceptions.AccessDeniedException;
import com.javaweb.exceptions.BusinessException;
import com.javaweb.exceptions.ResourceNotFoundException;
import com.javaweb.repositories.PostRepository;
import com.javaweb.repositories.PostTopicRepository;
import com.javaweb.repositories.UserRepository;
import com.javaweb.security.utils.SecurityUtils;
import com.javaweb.services.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final DTOConverter dtoConverter;
    private final UserRepository userRepository;
    private final PostTopicRepository postTopicRepository;

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

        Sort.Direction direction = Sort.Direction.fromString(sortOrder);

        pageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(direction, "createdAt")
        );

        Page<Post> pagePosts = postRepository.findAllPosts(title, postTopicId, status, pageable);
        return pagePosts.map(dtoConverter::toPostDTO);
    }


    @Override
    public Page<PostDTO> getAllPostsByTopicId(Long postTopicId, Pageable pageable, SearchPostRequest searchPostRequest) {
        String sortOrderRaw = searchPostRequest.sortOrder();
        String titleRaw = searchPostRequest.title();

        String sortOrder = (sortOrderRaw == null || sortOrderRaw.isBlank()) ? "DESC" : sortOrderRaw.toUpperCase();
        String title = (titleRaw == null || titleRaw.isBlank()) ? "" : titleRaw;

        Sort.Direction direction = Sort.Direction.fromString(sortOrder);

        pageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(direction, "createdAt")
        );

        Page<Post> pagePosts = postRepository.findAllPostByPostTopicId(title, postTopicId, pageable);
        return pagePosts.map(dtoConverter::toPostDTO);
    }

    @Override
    public void changeStatus(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Cannot find Post with id: " + postId));

        String currentUserEmail = SecurityUtils.getCurrentUserEmail();

        if (currentUserEmail == null || !currentUserEmail.equals(post.getUser().getEmail()) || !SecurityUtils.hasRole("ROLE_ADMIN")) {
            throw new AccessDeniedException("No access");
        }

        if (post.getStatus().equalsIgnoreCase("ACTIVE")) {
            post.setStatus(PostStatus.DELETED.getValue());
        } else if (post.getStatus().equalsIgnoreCase("DELETED")) {
            post.setStatus(PostStatus.ACTIVE.getValue());
        }
        postRepository.save(post);
    }

    @Override
    public PostDTO getPostById(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Cannot find Post with id: " + postId));
        return dtoConverter.toAdminPostDTO(post);
    }

    @Override
    public void createPost(PostRequest postRequest) {
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
                .status(PostStatus.ACTIVE.getValue())
                .build();
        postRepository.save(post);
    }

    @Override
    public void updatePost(Long postId, PostRequest postRequest) {
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
        if (newPostTopicId.equals(currentPostTopicId)) {
            PostTopic postTopic = postTopicRepository.findById(newPostTopicId).orElseThrow(
                    () -> new ResourceNotFoundException("Cannot find new Post Topic"));
            thisPost.setPostTopic(postTopic);
        }
        thisPost.setTitle(newTitle);
        thisPost.setContent(newContent);
        postRepository.save(thisPost);
    }


}
