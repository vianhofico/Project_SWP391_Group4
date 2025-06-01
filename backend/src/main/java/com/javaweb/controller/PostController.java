package com.javaweb.controller;

import com.javaweb.dto.response.ForumPostDTO;
import com.javaweb.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/forum/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public Page<ForumPostDTO> getAllPosts(Pageable pageable) {
        return postService.getAllPosts(pageable);
    }

    @GetMapping("/topic/{postTopicId}")
    public Page<ForumPostDTO> getAllPostsByTopicId(@PathVariable Long postTopicId, Pageable pageable) {
        return postService.getAllPostsByTopicId(postTopicId, pageable);
    }


}
