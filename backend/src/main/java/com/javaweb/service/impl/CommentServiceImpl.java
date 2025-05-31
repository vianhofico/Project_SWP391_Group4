package com.javaweb.service.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dto.CommentDTO;
import com.javaweb.entity.Comment;
import com.javaweb.repository.CommentRepository;
import com.javaweb.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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
}
