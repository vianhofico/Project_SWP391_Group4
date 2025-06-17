package com.javaweb.controller;

import com.javaweb.dtos.request.CommentSearchRequest;
import com.javaweb.dtos.request.PostSearchRequest;
import com.javaweb.dtos.response.CommentDTO;
import com.javaweb.dtos.response.PostDTO;
import com.javaweb.services.CommentService;
import com.javaweb.services.PostService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    public Page<PostDTO> getAllPostsByTopicId(@PathVariable @Positive(message = "postTopicId must positive") Long postTopicId
                                                    , Pageable pageable
                                                    , @ModelAttribute @Valid PostSearchRequest postSearchRequest) {
        return postService.getAllPostsByTopicId(postTopicId, pageable, postSearchRequest);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'LEARNER')")
    @PutMapping("/{postId}")// de xoa bai post
    public ResponseEntity<Void> changeStatus(@PathVariable @Positive(message = "postId must positive") Long postId) {
        postService.changeStatus(postId);
        return ResponseEntity.noContent().build();
    }

}
