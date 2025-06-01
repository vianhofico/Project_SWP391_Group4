package com.javaweb.service;

import com.javaweb.dto.response.ForumCommentDTO;
import com.javaweb.dto.response.admin.CommentDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CommentService {

    public Page<CommentDTO> getAllComments(Long userId, Pageable pageable);

    public List<ForumCommentDTO> getAllCommentsByParentCommentId(Long parentCommentId);

}
