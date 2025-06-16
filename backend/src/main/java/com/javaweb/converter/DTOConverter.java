package com.javaweb.converter;

import com.javaweb.dtos.response.ForumCommentDTO;
import com.javaweb.dtos.response.ForumPostDTO;
import com.javaweb.dtos.response.admin.*;
import com.javaweb.entities.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DTOConverter {

    private final DateTimeConverter dateTimeConverter;
    private final ModelMapper modelMapper;

    public CommentDTO toCommentDTO(Comment comment) {
        if (comment == null) return null;
        CommentDTO commentDTO = modelMapper.map(comment, CommentDTO.class);
        commentDTO.setCreatedAt(dateTimeConverter.toString(comment.getCreatedAt()));
        return commentDTO;
    }

    public EnrollmentDTO toEnrollmentDTO(Enrollment enrollment) {
        if (enrollment == null) return null;
        EnrollmentDTO enrollmentDTO = modelMapper.map(enrollment, EnrollmentDTO.class);
        enrollmentDTO.setEnrolledAt(dateTimeConverter.toString(enrollment.getEnrolledAt()));
        return enrollmentDTO;
    }

    public PostDTO toAdminPostDTO(Post post) {
        if (post == null) return null;
        PostDTO postDTO = modelMapper.map(post, PostDTO.class);
        postDTO.setCreatedAt(dateTimeConverter.toString(post.getCreatedAt()));
        return postDTO;
    }

    public ReportDTO toReportDTO(Report report) {
        if (report == null) return null;
        ReportDTO reportDTO = modelMapper.map(report, ReportDTO.class);
        reportDTO.setCreatedAt(dateTimeConverter.toString(report.getCreatedAt()));
        reportDTO.setComment(toCommentDTO(report.getComment()));
        reportDTO.setPost(toPostDTO(report.getPost()));
        return reportDTO;
    }

    public UserDTO toUserDTO(User user) {
        if (user == null) return null;
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        userDTO.setStatus((user.getIsActive() != null && user.getIsActive()) ? "Active" : "Inactive");
        userDTO.setCreatedAt(dateTimeConverter.toString(user.getCreatedAt()));
        userDTO.setBirthDate(dateTimeConverter.toString(user.getBirthDate()));
        return userDTO;
    }

    public ScoreDTO toScoreDTO(Score score) {
        if (score == null) return null;
        ScoreDTO scoreDTO = modelMapper.map(score, ScoreDTO.class);
        scoreDTO.setTakenAt(dateTimeConverter.toString(score.getTakenAt()));
        return scoreDTO;
    }

    public NotificationDTO toNotificationDTO(Notification notification) {
        if (notification == null) return null;
        NotificationDTO notificationDTO = modelMapper.map(notification, NotificationDTO.class);
        notificationDTO.setCreatedAt(dateTimeConverter.toString(notification.getCreatedAt()));
        return notificationDTO;
    }

    public RatingDTO toRatingDTO(Rating rating) {
        if (rating == null) return null;
        RatingDTO ratingDTO = modelMapper.map(rating, RatingDTO.class);
        ratingDTO.setCreatedAt(dateTimeConverter.toString(rating.getCreatedAt()));
        return ratingDTO;
    }

    public TransactionDTO toTransactionDTO(Transaction transaction) {
        if (transaction == null) return null;
        TransactionDTO transactionDTO = modelMapper.map(transaction, TransactionDTO.class);
        transactionDTO.setPaidAt(dateTimeConverter.toString(transaction.getPaidAt()));
        return transactionDTO;
    }

    public CartDTO toCartDTO(Cart cart) {
        return (cart != null) ? modelMapper.map(cart, CartDTO.class) : null;
    }

    public PostTopicDTO toPostTopicDTO(PostTopic postTopic) {
        if(postTopic == null) return null;
        PostTopicDTO postTopicDTO = modelMapper.map(postTopic, PostTopicDTO.class);
        postTopicDTO.setCreatedAt(dateTimeConverter.toString(postTopic.getCreatedAt()));
        return postTopicDTO;
    }

    public PostDTO toPostDTO(Post post) {
        if (post == null) return null;
        PostDTO postDTO = modelMapper.map(post, PostDTO.class);
        postDTO.setCreatedAt(dateTimeConverter.toString(post.getCreatedAt()));
        postDTO.setUser(toUserDTO(post.getUser()));
        postDTO.setPostTopic(toPostTopicDTO(post.getPostTopic()));
        return postDTO;
    }

    public ForumCommentDTO toForumCommentDTO(Comment comment) {
        if (comment == null) return null;
        ForumCommentDTO forumCommentDTO = modelMapper.map(comment, ForumCommentDTO.class);
        forumCommentDTO.setCreatedAt(dateTimeConverter.toString(comment.getCreatedAt()));
        forumCommentDTO.setUser(toUserDTO(comment.getUser()));
        forumCommentDTO.setParentComment(toForumCommentDTO(comment.getParentComment()));
        return forumCommentDTO;
    }

    public ForumPostDTO toForumPostDTO(Post post) {
        if (post == null) return null;
        return ForumPostDTO.builder()
                .postId(post.getPostId())
                .title(post.getTitle())
                .content(post.getContent())
                .createdAt(dateTimeConverter.toString(post.getCreatedAt()))
                .user(toUserDTO(post.getUser()))
                .postTopic(toPostTopicDTO(post.getPostTopic()))
                .comments(post.getComments().stream()
                        .map(this::toForumCommentDTO)
                        .toList())
                .build();
    }
}
