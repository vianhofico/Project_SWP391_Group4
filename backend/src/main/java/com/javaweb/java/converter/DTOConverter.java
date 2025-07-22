package com.javaweb.java.converter;


import com.javaweb.java.entities.*;
import com.javaweb.java.dtos.response.*;
import dev.likeech.java.entity.*;
import dev.likeech.java.model.dto.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import javax.management.Notification;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DTOConverter {

    private final DateTimeConverter dateTimeConverter;
    private final ModelMapper modelMapper;

    public CommentDTO toCommentDTO(Comment comment) {
        if (comment == null) return null;
        CommentDTO commentDTO = modelMapper.map(comment, CommentDTO.class);
        commentDTO.setCreatedAt(dateTimeConverter.toString(comment.getCreatedAt()));
        commentDTO.setUser(toUserDTO(comment.getUser()));
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
        reportDTO.setReportType(report.getReportType().name());
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
//        notificationDTO.setCreatedAt(dateTimeConverter.toString(notification.get()));
        return notificationDTO;
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
        if (postTopic == null) return null;
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

    public PostFile toPostFile(UploadFileDTO uploadFileDTO, Post post) {
        if (uploadFileDTO == null) return null;
        PostFile postFile = modelMapper.map(uploadFileDTO, PostFile.class);
        postFile.setPost(post);
        return postFile;
    }

    public PostFileDTO toPostFileDTO(PostFile postFile) {
        if (postFile == null) return null;
        return modelMapper.map(postFile, PostFileDTO.class);
    }

    public OrderDTO toOrderDTO(Order order) {
        if (order == null) return null;

        OrderDTO dto = new OrderDTO();
        dto.setOrderId(order.getOrderId());
        dto.setAmount(order.getTotalPrice());
        dto.setCreatedAt(dateTimeConverter.toString(order.getCreatedAt()));
        dto.setUser(toUserDTO(order.getUser()));

        List<OrderItemDTO> itemDTOs = new ArrayList<>();
        for (OrderItem item : order.getOrderItems()) {
            OrderItemDTO itemDTO = new OrderItemDTO();
            itemDTO.setOrderItemId(item.getOrderItemId());
            itemDTO.setPrice(item.getPrice().longValue());

            Course course = item.getCourse();
            CourseSummaryDTO courseSummaryDTO = new CourseSummaryDTO();
            courseSummaryDTO.setCourseId(course.getCourseId());
            courseSummaryDTO.setTitle(course.getTitle());
            courseSummaryDTO.setPrice(course.getPrice());
            courseSummaryDTO.setImageUrl(course.getImageUrl());

            itemDTO.setCourse(courseSummaryDTO);
            itemDTOs.add(itemDTO);
        }

        dto.setOrderItems(itemDTOs);
        return dto;
    }

public DiscountEventDTO toDiscountEventDTO(DiscountEvent event) {
        if (event == null) return null;
        DiscountEventDTO discountEventDTO = modelMapper.map(event, DiscountEventDTO.class);
        DiscountEventDTO dto = new DiscountEventDTO();
        dto.setId(event.getId());
        dto.setName(event.getName());
        dto.setDiscountValue(event.getDiscountValue());
        dto.setDiscountType(event.getDiscountType());
        if(event.getCourse() != null) {
            dto.setCourseId(event.getCourse().getCourseId());
            dto.setCourseName(event.getCourse().getTitle());
        }
        dto.setStartDate(event.getStartDate());
        dto.setEndDate(event.getEndDate());

        return dto;
    }

    public CourseSummaryDTO toCourseSummaryDTO(Course course) {
        CourseSummaryDTO dto = new CourseSummaryDTO();
        dto.setCourseId(course.getCourseId());
        dto.setTitle(course.getTitle());
        dto.setTitle(course.getTitle());
        dto.setPrice(course.getPrice());
        dto.setImageUrl(course.getImageUrl());
        return dto;
    }
}
