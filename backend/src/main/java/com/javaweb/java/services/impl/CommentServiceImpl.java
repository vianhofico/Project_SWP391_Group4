package com.javaweb.java.services.impl;


import com.javaweb.java.entities.Comment;
import com.javaweb.java.entities.Post;
import com.javaweb.java.entities.User;
import com.javaweb.java.exceptions.BusinessException;
import com.javaweb.java.exceptions.ResourceNotFoundException;
import com.javaweb.java.converter.DTOConverter;
import com.javaweb.java.dtos.response.CommentDTO;
import com.javaweb.java.dtos.request.CommentRequest;
import com.javaweb.java.dtos.request.SearchCommentRequest;
import com.javaweb.java.repositories.CommentRepository;
import com.javaweb.java.repositories.PostRepository;
import com.javaweb.java.repositories.UserRepository;
import com.javaweb.java.security.utils.SecurityUtils;
import com.javaweb.java.services.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public Page<CommentDTO> getAllCommentsOfUser(Long userId, Pageable pageable) {
        Page<Comment> pageComments = commentRepository.findByUserUserId(userId, pageable);
        return pageComments.map(dtoConverter::toCommentDTO);
    }


    @Override
    public Page<CommentDTO> getAllCommentsByPostId(Long postId, SearchCommentRequest searchCommentRequest, Pageable pageable) {
        String content = searchCommentRequest.content();
        String userFullName = searchCommentRequest.userFullName();
        String sortOrder = (searchCommentRequest.sortOrder() == null ? "DESC" : searchCommentRequest.sortOrder().toUpperCase());
        String statusRaw = searchCommentRequest.status();
        String status = null;
        if (SecurityUtils.getCurrentUserEmail() == null || SecurityUtils.hasRole("ROLE_LEARNER")) {
            status = "ACTIVE";
        } else {
            if (!statusRaw.isBlank()) {
                status = statusRaw.toUpperCase();
            }
        }

        Sort.Direction direction = Sort.Direction.fromString(sortOrder);

        pageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(direction, "createdAt"));

        Page<Comment> pageComments = commentRepository.findAllCommentsByPostId(postId, content, userFullName, status, pageable);
        return pageComments.map(dtoConverter::toCommentDTO);
    }

    @Override// only for learner
    public Page<CommentDTO> getAllTopLevelCommentsByPostId(Long postId, SearchCommentRequest searchCommentRequest, Pageable pageable) {
        String sortOrder = (searchCommentRequest.sortOrder() == null ? "DESC" : searchCommentRequest.sortOrder().toUpperCase());
        String status = "ACTIVE";
        Sort.Direction direction = Sort.Direction.fromString(sortOrder);

        pageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(direction, "createdAt"));

        Page<Comment> comments = commentRepository.findAllTopLevelCommentsByPostId(postId, status, pageable);
        return comments.map(dtoConverter::toCommentDTO);
    }

    @Override// only for learner
    public Page<CommentDTO> getAllChildCommentsByParentCommentId(Long parentCommentId, SearchCommentRequest searchCommentRequest, Pageable pageable) {
        String sortOrder = (searchCommentRequest.sortOrder() == null ? "DESC" : searchCommentRequest.sortOrder().toUpperCase());
        String status = "ACTIVE";
        Sort.Direction direction = Sort.Direction.fromString(sortOrder);

        pageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(direction, "createdAt"));

        Page<Comment> comments = commentRepository.findCommentsByParentCommentId(parentCommentId, status, pageable);
        return comments.map(dtoConverter::toCommentDTO);

    }

    @Override
    public CommentDTO getCommentById(Long commentId) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(
                () -> new ResourceNotFoundException("Comment with id " + commentId + " not found!")
        );
        return dtoConverter.toCommentDTO(comment);
    }



    @Transactional
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
                .status("ACTIVE")
                .build();
        commentRepository.save(comment);
    }

    @Transactional
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

    @Transactional
    @Override
    public void deleteComment(Long commentId) {
        Comment thisComment = commentRepository.findById(commentId).orElseThrow(
                () -> new ResourceNotFoundException("Comment with id " + commentId + " not found!"));

        String currentUserEmail = SecurityUtils.getCurrentUserEmail();
        if (!thisComment.getUser().getEmail().equals(currentUserEmail) && !SecurityUtils.hasRole("ROLE_ADMIN")) {
            throw new BusinessException("You cannot delete this comment");
        }

        thisComment.setStatus("DELETED");
        commentRepository.save(thisComment);
    }


    @Transactional
    @Override
    public void activateComment(Long commentId) {
        Comment thisComment = commentRepository.findById(commentId).orElseThrow(
                () -> new ResourceNotFoundException("Comment with id " + commentId + " not found!"));

        if (!SecurityUtils.hasRole("ROLE_ADMIN")) {
            throw new BusinessException("You cannot activate this comment");
        }

        thisComment.setStatus("ACTIVE");
        commentRepository.save(thisComment);
    }
}
