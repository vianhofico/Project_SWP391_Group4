package com.javaweb.controller;

import com.javaweb.dtos.request.SearchPostTopicRequest;
import com.javaweb.dtos.response.PostTopicDTO;
import com.javaweb.services.PostTopicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posttopics")
@RequiredArgsConstructor
public class PostTopicController {

    private final PostTopicService postTopicService;

    @GetMapping
    public Page<PostTopicDTO> getAllPostTopics(@ModelAttribute @Valid SearchPostTopicRequest searchPostTopicRequest, Pageable pageable) {
        return postTopicService.getAllPostTopics(searchPostTopicRequest, pageable);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Void> createPostTopic(@RequestBody PostTopicDTO postTopicDTO) {
        postTopicService.createPostTopic(postTopicDTO);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{postTopicId}")
    public ResponseEntity<Void> editPostTopic(@RequestBody PostTopicDTO postTopicDTO, @PathVariable Long postTopicId) {
        postTopicService.editPostTopic(postTopicDTO, postTopicId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{postTopicId}")
    public ResponseEntity<Void> deletePostTopic(@PathVariable Long postTopicId) {
        postTopicService.deletePostTopic(postTopicId);
        return ResponseEntity.noContent().build();
    }
}
