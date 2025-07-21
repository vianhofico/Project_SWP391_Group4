package dev.likeech.java.controller;


import dev.likeech.java.model.dto.CommentDTO;
import dev.likeech.java.model.request.CommentRequest;
import dev.likeech.java.model.request.SearchCommentRequest;
import dev.likeech.java.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/{commentId}")
    public ResponseEntity<CommentDTO> getCommentById(@PathVariable Long commentId) {
        return ResponseEntity.ok(commentService.getCommentById(commentId));
    }

    @GetMapping("/{parentCommentId}/replies")
    public Page<CommentDTO> getCommentsByParentCommentId(@PathVariable Long parentCommentId, @Valid @ModelAttribute SearchCommentRequest searchCommentRequest, Pageable pageable) {
        return commentService.getAllChildCommentsByParentCommentId(parentCommentId, searchCommentRequest, pageable);
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

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{commentId}/activate")
    public ResponseEntity<Void> activateComment(@PathVariable Long commentId) {
        commentService.activateComment(commentId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN','LEARNER')")
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
}
