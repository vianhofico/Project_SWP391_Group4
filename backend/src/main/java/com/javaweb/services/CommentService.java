package com.javaweb.services;

import com.javaweb.dtos.request.CommentSearchRequest;
import com.javaweb.dtos.response.CommentDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CommentService {

    Page<CommentDTO> getAllComments(Long userId, Pageable pageable);

    Page<CommentDTO> getAllCommentsByPostId(Long postId, CommentSearchRequest commentSearchRequest, Pageable pageable);

    CommentDTO getCommentById(Long commentId);

}
