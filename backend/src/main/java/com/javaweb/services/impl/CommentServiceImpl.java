package com.javaweb.services.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dtos.request.CommentSearchRequest;
import com.javaweb.dtos.response.CommentDTO;
import com.javaweb.entities.Comment;
import com.javaweb.exceptions.ResourceNotFoundException;
import com.javaweb.repositories.CommentRepository;
import com.javaweb.services.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    public Page<CommentDTO> getAllCommentsByPostId(Long postId, CommentSearchRequest commentSearchRequest, Pageable pageable) {
        String content = commentSearchRequest.content();
        String userFullName = commentSearchRequest.userFullName();
        String sortOrder = (commentSearchRequest.sortOrder() == null ? "DESC" : commentSearchRequest.sortOrder().toUpperCase());

        Sort.Direction direction = Sort.Direction.fromString(sortOrder);

        pageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(direction, "createdAt"));

        Page<Comment> pageComments = commentRepository.findAllCommentsByPostId(postId, content, userFullName, pageable);
        return pageComments.map(dtoConverter::toCommentDTO);
    }

    @Override
    public CommentDTO getCommentById(Long commentId) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(
                () -> new ResourceNotFoundException("Comment with id " + commentId + " not found!")
        );
        return dtoConverter.toCommentDTO(comment);
    }

}
