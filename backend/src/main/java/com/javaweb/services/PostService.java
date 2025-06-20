package com.javaweb.services;

import com.javaweb.dtos.request.PostSearchRequest;
import com.javaweb.dtos.response.PostDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostService {

    Page<PostDTO> getAllPostsOfUser(Long userId, Pageable pageable);

    Page<PostDTO> getAllPosts(PostSearchRequest postSearchRequest, Pageable pageable);

    Page<PostDTO> getAllPostsByTopicId(Long postTopicId, Pageable pageable, PostSearchRequest postSearchRequest);

    void changeStatus(Long postId);//deleted or active

    PostDTO getPostById(Long postId);


}
