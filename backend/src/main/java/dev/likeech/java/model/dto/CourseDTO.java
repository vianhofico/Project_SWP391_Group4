package dev.likeech.java.model.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {
    private Long courseId;
    private String title;
    private String description;
    private Long price;
    private String topic;
    private LocalDateTime createdAt;
    private LocalDateTime updateAt;
    private Double rating;
    private String imageUrl;
    private String status;
    private String videoTrialUrl;
    private List<Long> attachmentIds;
    private List<Long> topicIds;
    private List<Long> enrollmentIds;
    private Float progress;
}
