package com.javaweb.controller;

import com.javaweb.dtos.request.PostSearchRequest;
import com.javaweb.dtos.response.ForumPostDTO;
import com.javaweb.dtos.response.admin.PostDTO;
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

    @GetMapping
    public Page<PostDTO> getAllPosts(@Valid @ModelAttribute PostSearchRequest postSearchRequest, Pageable pageable) {
        return postService.getAllPosts(postSearchRequest, pageable);
    }

    @GetMapping("/topic/{postTopicId}")
    public Page<ForumPostDTO> getAllPostsByTopicId(@PathVariable @Positive(message = "postTopicId must positive") Long postTopicId, Pageable pageable, @ModelAttribute PostSearchRequest postSearchRequest) {
        return postService.getAllPostsByTopicId(postTopicId, pageable, postSearchRequest);
    }

    @PutMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable @Positive(message = "postId must positive") Long postId) {
        postService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }

}
