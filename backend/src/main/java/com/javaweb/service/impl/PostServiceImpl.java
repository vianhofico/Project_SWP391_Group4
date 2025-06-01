package com.javaweb.service.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dto.response.ForumPostDTO;
import com.javaweb.dto.response.admin.PostDTO;
import com.javaweb.entity.Post;
import com.javaweb.repository.PostRepository;
import com.javaweb.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    public Page<ForumPostDTO> getAllPosts(Pageable pageable) {
        Page<Post> pagePosts = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        return pagePosts.map(dtoConverter::toForumPostDTO);
    }

    @Override
    public Page<ForumPostDTO> getAllPostsByTopicId(Long postTopicId, Pageable pageable) {
        Page<Post> pagePosts = postRepository.findByPostTopicPostTopicIdOrderByCreatedAtDesc(postTopicId, pageable);
        return pagePosts.map(dtoConverter::toForumPostDTO);
    }


}
