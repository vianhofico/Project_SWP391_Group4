package com.javaweb.service.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dto.PostDTO;
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
    public Page<PostDTO> getAllPosts(Long userId, Pageable pageable) {
        Page<Post> pagePosts = postRepository.findByUserUserId(userId, pageable);
        return pagePosts.map(dtoConverter::toPostDTO);
    }
}
