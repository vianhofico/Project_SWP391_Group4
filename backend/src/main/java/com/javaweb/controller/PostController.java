package com.javaweb.controller;

import com.javaweb.dtos.request.PostRequest;
import com.javaweb.dtos.request.SearchCommentRequest;
import com.javaweb.dtos.request.SearchPostRequest;
import com.javaweb.dtos.response.CommentDTO;
import com.javaweb.dtos.response.PostDTO;
import com.javaweb.services.CommentService;
import com.javaweb.services.PostService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Validated
public class PostController {

    private final PostService postService;
    private final CommentService commentService;

    @GetMapping
    public Page<PostDTO> getAllPosts(@Valid @ModelAttribute SearchPostRequest searchPostRequest, Pageable pageable) {
        return postService.getAllPosts(searchPostRequest, pageable);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable @Positive(message = "postId must positive") Long postId) {
        return ResponseEntity.ok(postService.getPostById(postId));
    }

    @GetMapping("/{postId}/comments")
    public Page<CommentDTO> getAllCommentsByPostId(@PathVariable Long postId
            , @Valid @ModelAttribute SearchCommentRequest searchCommentRequest
            , Pageable pageable) {
        return commentService.getAllCommentsByPostId(postId, searchCommentRequest, pageable);
    }

    @GetMapping("/topic/{postTopicId}")
    public Page<PostDTO> getAllPostsByTopicId(@PathVariable Long postTopicId
            , Pageable pageable
            , @ModelAttribute @Valid SearchPostRequest searchPostRequest) {
        return postService.getAllPostsByTopicId(postTopicId, pageable, searchPostRequest);
    }

    @GetMapping("/{postId}/comments/top-level")
    public Page<CommentDTO> getAllTopLevelCommentsByPostId(@PathVariable Long postId, @Valid @ModelAttribute SearchCommentRequest searchCommentRequest, Pageable pageable) {
        return commentService.getAllTopLevelCommentsByPostId(postId, searchCommentRequest, pageable);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> createPost(
            @RequestPart("post") @Valid PostRequest postRequest,
            @RequestPart(value = "file", required = false) List<MultipartFile> files
    ) throws IOException {
        postService.createPost(postRequest, files);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @PutMapping("/{postId}/activate")
    public ResponseEntity<Void> activatePost(@PathVariable Long postId) {
        postService.changeStatus(postId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'LEARNER')")
    @PutMapping("/{postId}")
    public ResponseEntity<Void> updatePost(@PathVariable Long postId, @Valid @RequestBody PostRequest postRequest) {
        postService.updatePost(postId, postRequest);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'LEARNER')")
    @DeleteMapping("/{postId}")// de xoa bai post
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        postService.changeStatus(postId);
        return ResponseEntity.noContent().build();
    }


}
