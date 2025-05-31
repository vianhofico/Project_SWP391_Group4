package com.javaweb.converter;

import com.javaweb.dto.*;
import com.javaweb.entity.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DTOConverter {

    private final ModelMapper modelMapper;

    public CommentDTO toCommentDTO(Comment comment) {
        return (comment != null) ? modelMapper.map(comment, CommentDTO.class) : null;
    }

    public EnrollmentDTO toEnrollmentDTO(Enrollment enrollment) {
        return (enrollment != null) ? modelMapper.map(enrollment, EnrollmentDTO.class) : null;
    }

    public PostDTO toPostDTO(Post post) {
        return (post != null) ? modelMapper.map(post, PostDTO.class) : null;
    }

    public ReportDTO toReportDTO(Report report) {
        return (report != null) ? modelMapper.map(report, ReportDTO.class) : null;
    }

    public UserDTO toUserDTO(User user) {
        if (user == null) return null;
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        userDTO.setStatus((user.getIsActive() != null && user.getIsActive()) ? "Active" : "Inactive");
        return userDTO;
    }

    public ScoreDTO toScoreDTO(Score score) {
        return (score != null) ? modelMapper.map(score, ScoreDTO.class) : null;
    }

    public NotificationDTO toNotificationDTO(Notification notification) {
        return (notification != null) ? modelMapper.map(notification, NotificationDTO.class) : null;
    }

    public RatingDTO toRatingDTO(Rating rating) {
        return (rating != null) ? modelMapper.map(rating, RatingDTO.class) : null;
    }

    public TransactionDTO toTransactionDTO(Transaction transaction) {
        return (transaction != null) ? modelMapper.map(transaction, TransactionDTO.class) : null;
    }

    public CartDTO toCartDTO(Cart cart) {
        return (cart != null) ? modelMapper.map(cart, CartDTO.class) : null;
    }

}
