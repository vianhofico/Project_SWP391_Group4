package dev.likeech.java.controller;


import dev.likeech.java.model.dto.PostTopicDTO;
import dev.likeech.java.model.request.SearchPostTopicRequest;
import dev.likeech.java.service.PostTopicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posttopics")
@RequiredArgsConstructor
public class PostTopicController {

    private final PostTopicService postTopicService;

    @GetMapping("/pages")
    public Page<PostTopicDTO> getPagePostTopics(@ModelAttribute @Valid SearchPostTopicRequest searchPostTopicRequest, Pageable pageable) {
        return postTopicService.getPagePostTopics(searchPostTopicRequest, pageable);
    }

    @GetMapping
    public List<PostTopicDTO> getAllPostTopics(@ModelAttribute @Valid SearchPostTopicRequest searchPostTopicRequest) {
        return postTopicService.getAllPostTopics(searchPostTopicRequest);
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
