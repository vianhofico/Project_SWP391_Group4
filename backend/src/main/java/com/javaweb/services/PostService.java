package com.javaweb.services;

import com.javaweb.dtos.request.PostSearchRequest;
import com.javaweb.dtos.response.ForumPostDTO;
import com.javaweb.dtos.response.admin.PostDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostService {

    Page<PostDTO> getAllPostsOfUser(Long userId, Pageable pageable);

    Page<PostDTO> getAllPosts(PostSearchRequest postSearchRequest, Pageable pageable);

    Page<ForumPostDTO> getAllPostsByTopicId(Long postTopicId, Pageable pageable, PostSearchRequest postSearchRequest);

    void deletePost(Long postId);

}
