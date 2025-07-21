package dev.likeech.java.service;


import dev.likeech.java.model.dto.CommentDTO;
import dev.likeech.java.model.request.CommentRequest;
import dev.likeech.java.model.request.SearchCommentRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CommentService {

    Page<CommentDTO> getAllCommentsOfUser(Long userId, Pageable pageable);

    Page<CommentDTO> getAllCommentsByPostId(Long postId, SearchCommentRequest searchCommentRequest, Pageable pageable);

    Page<CommentDTO> getAllTopLevelCommentsByPostId(Long postId, SearchCommentRequest searchCommentRequest, Pageable pageable);

    Page<CommentDTO> getAllChildCommentsByParentCommentId(Long parentCommentId, SearchCommentRequest searchCommentRequest, Pageable pageable);

    CommentDTO getCommentById(Long commentId);

    void createComment(Long postId, CommentRequest commentRequest);

    void updateComment(Long commentId, CommentRequest commentRequest);

    void deleteComment(Long commentId);

    void activateComment(Long commentId);
}
