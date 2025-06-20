package com.javaweb.services.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dtos.request.CommentRequest;
import com.javaweb.dtos.request.SearchCommentRequest;
import com.javaweb.dtos.response.CommentDTO;
import com.javaweb.entities.Comment;
import com.javaweb.entities.Post;
import com.javaweb.entities.User;
import com.javaweb.exceptions.BusinessException;
import com.javaweb.exceptions.ResourceNotFoundException;
import com.javaweb.repositories.CommentRepository;
import com.javaweb.repositories.PostRepository;
import com.javaweb.repositories.UserRepository;
import com.javaweb.security.utils.SecurityUtils;
import com.javaweb.services.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final DTOConverter dtoConverter;

    @Override
    public Page<CommentDTO> getAllComments(Long userId, Pageable pageable) {
        Page<Comment> pageComments = commentRepository.findByUserUserId(userId, pageable);
        return pageComments.map(dtoConverter::toCommentDTO);
    }


    @Override
    public Page<CommentDTO> getAllCommentsByPostId(Long postId, SearchCommentRequest searchCommentRequest, Pageable pageable) {
        String content = searchCommentRequest.content();
        String userFullName = searchCommentRequest.userFullName();
        String sortOrder = (searchCommentRequest.sortOrder() == null ? "DESC" : searchCommentRequest.sortOrder().toUpperCase());

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

    @Override
    public void createComment(Long postId, CommentRequest commentRequest) {
        String currentUserEmail = SecurityUtils.getCurrentUserEmail();
        User currentUser = userRepository.findByEmail(currentUserEmail).orElseThrow(
                () -> new ResourceNotFoundException("Cannot find User with email: " + currentUserEmail));

        Post currentPost = postRepository.findById(postId).orElseThrow(
                () -> new ResourceNotFoundException("Post with id " + postId + " not found!"));

        Comment parentComment = null;
        if (commentRequest.parentCommentId() != null) {
            parentComment = commentRepository.findById(commentRequest.parentCommentId()).orElseThrow(
                    () -> new ResourceNotFoundException("Comment with id " + commentRequest.parentCommentId() + " not found!"));
        }

        if (parentComment != null) {
            if (parentComment.getPost().getPostId() != postId) {
                throw new BusinessException("Parent comment not on same post");
            }
        }

        String content = commentRequest.content();
        LocalDateTime now = LocalDateTime.now();

        Comment comment = Comment
                .builder()
                .content(content)
                .createdAt(now)
                .parentComment(parentComment)
                .user(currentUser)
                .post(currentPost)
                .build();
        commentRepository.save(comment);
    }

    @Override
    public void updateComment(Long commentId, CommentRequest commentRequest) {
        Comment thisComment = commentRepository.findById(commentId).orElseThrow(
                () -> new ResourceNotFoundException("Comment with id " + commentId + " not found!"));

        String currentUserEmail = SecurityUtils.getCurrentUserEmail();
        if (!thisComment.getUser().getEmail().equals(currentUserEmail)) {
            throw new BusinessException("You cannot edit this comment");
        }

        // comment được sửa trong vòng 1h
        Duration duration = Duration.between(thisComment.getCreatedAt(), LocalDateTime.now());
        if (duration.toMinutes() > 60) {
            throw new BusinessException("Comments can only be edited within 1 hour");
        }

        String newContent = commentRequest.content();
        thisComment.setContent(newContent);
        commentRepository.save(thisComment);
    }

}
