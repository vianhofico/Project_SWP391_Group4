package com.javaweb.services.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dtos.request.PostSearchRequest;
import com.javaweb.dtos.response.ForumPostDTO;
import com.javaweb.dtos.response.admin.PostDTO;
import com.javaweb.entities.Post;
import com.javaweb.exceptions.ResourceNotFoundException;
import com.javaweb.repositories.PostRepository;
import com.javaweb.services.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final DTOConverter dtoConverter;

    @Override
    public Page<PostDTO> getAllPostsOfUser(Long userId, Pageable pageable) {
        Page<Post> pagePosts = postRepository.findByUserUserId(userId, pageable);
        return pagePosts.map(dtoConverter::toAdminPostDTO);
    }

    @Override
    public Page<PostDTO> getAllPosts(PostSearchRequest postSearchRequest, Pageable pageable) {
        String sortOrderRaw = postSearchRequest.sortOrder();
        String titleRaw = postSearchRequest.title();
        String postTopicIdRaw = postSearchRequest.postTopicId();
        String statusRaw = postSearchRequest.status();

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
    public Page<ForumPostDTO> getAllPostsByTopicId(Long postTopicId, Pageable pageable, PostSearchRequest postSearchRequest) {
        String sortOrderRaw = postSearchRequest.sortOrder();
        String titleRaw = postSearchRequest.title();

        String sortOrder = (sortOrderRaw == null || sortOrderRaw.isBlank()) ? "DESC" : sortOrderRaw.toUpperCase();
        String title = (titleRaw == null || titleRaw.isBlank()) ? "" : titleRaw;

        Sort.Direction direction = Sort.Direction.fromString(sortOrder);

        pageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(direction, "createdAt")
        );

        Page<Post> pagePosts = postRepository.findAllPostByPostTopicId(title, postTopicId, pageable);
        return pagePosts.map(dtoConverter::toForumPostDTO);
    }

    @Override
    public void deletePost(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Cannot find Post with id: " + postId));
        post.setStatus("DELETED");
        postRepository.save(post);
    }
}
