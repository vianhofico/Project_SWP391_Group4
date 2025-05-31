package com.javaweb.service;

import com.javaweb.dto.PostDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostService {

    public Page<PostDTO> getAllPosts(Long userId, Pageable pageable);
}
