package com.javaweb.services;

import com.javaweb.dtos.request.CommentRequest;
import com.javaweb.dtos.request.SearchCommentRequest;
import com.javaweb.dtos.response.CommentDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CommentService {

    Page<CommentDTO> getAllComments(Long userId, Pageable pageable);

    Page<CommentDTO> getAllCommentsByPostId(Long postId, SearchCommentRequest searchCommentRequest, Pageable pageable);

    CommentDTO getCommentById(Long commentId);

    void createComment(Long postId, CommentRequest commentRequest);

    void updateComment(Long commentId, CommentRequest commentRequest);

}
