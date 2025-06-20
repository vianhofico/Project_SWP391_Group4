package com.javaweb.controller;

import com.javaweb.dtos.request.CommentRequest;
import com.javaweb.dtos.response.CommentDTO;
import com.javaweb.services.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/{commentId}")
    public ResponseEntity<CommentDTO> getCommentById(@PathVariable Long commentId) {
        return ResponseEntity.ok(commentService.getCommentById(commentId));
    }

    @PreAuthorize("hasRole('LEARNER')")
    @PostMapping("/{postId}")
    public ResponseEntity<Void> createComment(@PathVariable Long postId, @RequestBody @Valid CommentRequest commentRequest) {
        commentService.createComment(postId, commentRequest);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('LEARNER')")
    @PutMapping("/{commentId}")
    public ResponseEntity<Void> updateComment(@PathVariable Long commentId, @RequestBody @Valid CommentRequest commentRequest) {
        commentService.updateComment(commentId, commentRequest);
        return ResponseEntity.noContent().build();
    }
}
