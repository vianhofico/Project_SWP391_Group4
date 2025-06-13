package com.javaweb.services;

import com.javaweb.dtos.request.CommentSearchRequest;
import com.javaweb.dtos.response.ForumCommentDTO;
import com.javaweb.dtos.response.admin.CommentDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CommentService {

    Page<CommentDTO> getAllComments(Long userId, Pageable pageable);

    List<ForumCommentDTO> getAllCommentsByParentCommentId(Long parentCommentId);

    Page<CommentDTO> getAllCommentsByPostId(Long postId, CommentSearchRequest commentSearchRequest, Pageable pageable);

    CommentDTO getCommentById(Long commentId);

}
