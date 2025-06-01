package com.javaweb.service;

import com.javaweb.dto.response.ForumPostDTO;
import com.javaweb.dto.response.admin.PostDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostService {

    public Page<PostDTO> getAllPostsOfUser(Long userId, Pageable pageable);

    public Page<ForumPostDTO> getAllPosts(Pageable pageable);

    public Page<ForumPostDTO> getAllPostsByTopicId(Long postTopicId, Pageable pageable);

}
