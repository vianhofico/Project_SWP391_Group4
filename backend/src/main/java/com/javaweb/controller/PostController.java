package com.javaweb.controller;

import com.javaweb.dtos.request.CommentSearchRequest;
import com.javaweb.dtos.request.PostSearchRequest;
import com.javaweb.dtos.response.ForumPostDTO;
import com.javaweb.dtos.response.admin.CommentDTO;
import com.javaweb.dtos.response.admin.PostDTO;
import com.javaweb.services.CommentService;
import com.javaweb.services.PostService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Validated
public class PostController {

    private final PostService postService;
    private final CommentService commentService;

    @GetMapping
    public Page<PostDTO> getAllPosts(@Valid @ModelAttribute PostSearchRequest postSearchRequest, Pageable pageable) {
        return postService.getAllPosts(postSearchRequest, pageable);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable @Positive(message = "postId must positive") Long postId) {
        return ResponseEntity.ok(postService.getPostById(postId));
    }

    @GetMapping("/{postId}/comments")
    public Page<CommentDTO> getAllCommentsByPostId(@PathVariable @Positive(message = "postId must positive") Long postId
                                                    ,@Valid @ModelAttribute CommentSearchRequest commentSearchRequest
                                                    , Pageable pageable) {
        return commentService.getAllCommentsByPostId(postId, commentSearchRequest, pageable);
    }


    @GetMapping("/topic/{postTopicId}")
    public Page<ForumPostDTO> getAllPostsByTopicId(@PathVariable @Positive(message = "postTopicId must positive") Long postTopicId
                                                    , Pageable pageable
                                                    , @ModelAttribute PostSearchRequest postSearchRequest) {
        return postService.getAllPostsByTopicId(postTopicId, pageable, postSearchRequest);
    }

    @PutMapping("/{postId}")
    public ResponseEntity<Void> changeStatus(@PathVariable @Positive(message = "postId must positive") Long postId) {
        postService.changeStatus(postId);
        return ResponseEntity.noContent().build();
    }

}
