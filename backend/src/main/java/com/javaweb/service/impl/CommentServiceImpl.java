package com.javaweb.service.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dto.response.ForumCommentDTO;
import com.javaweb.dto.response.admin.CommentDTO;
import com.javaweb.entity.Comment;
import com.javaweb.repository.CommentRepository;
import com.javaweb.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final DTOConverter dtoConverter;

    @Override
    public Page<CommentDTO> getAllComments(Long userId, Pageable pageable) {
        Page<Comment> pageComments = commentRepository.findByUserUserId(userId, pageable);
        return pageComments.map(dtoConverter::toCommentDTO);
    }

    @Override
    public List<ForumCommentDTO> getAllCommentsByParentCommentId(Long parentCommentId) {
        List<Comment> comments = commentRepository.findByParentCommentCommentId(parentCommentId);
        return comments.stream()
                .map(dtoConverter::toForumCommentDTO)
                .toList();
    }
}
