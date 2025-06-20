package com.javaweb.services;

import com.javaweb.dtos.request.PostRequest;
import com.javaweb.dtos.request.SearchPostRequest;
import com.javaweb.dtos.response.PostDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostService {

    Page<PostDTO> getAllPostsOfUser(Long userId, Pageable pageable);

    Page<PostDTO> getAllPosts(SearchPostRequest searchPostRequest, Pageable pageable);

    Page<PostDTO> getAllPostsByTopicId(Long postTopicId, Pageable pageable, SearchPostRequest searchPostRequest);

    void changeStatus(Long postId);//deleted or active

    PostDTO getPostById(Long postId);

    void createPost(PostRequest postRequest);

    void updatePost(Long postId, PostRequest postRequest);

}
