package com.javaweb.controller;

import com.javaweb.dtos.request.PostTopicSearchRequest;
import com.javaweb.dtos.response.PostTopicDTO;
import com.javaweb.services.PostTopicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posttopics")
@RequiredArgsConstructor
public class PostTopicController {

    private final PostTopicService postTopicService;

    @GetMapping
    public List<PostTopicDTO> getAllPostTopics(@ModelAttribute @Valid PostTopicSearchRequest postTopicSearchRequest) {
        return postTopicService.getAllPostTopics(postTopicSearchRequest);
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
}
