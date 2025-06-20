package dev.likeech.java.model.dto;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class LessonDTO {
    private Long lessonId;
    private String title;
    private Integer lessonOrder;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updateAt;
    private Long chapterId;
    private String content;
    private String mainVideoUrl;
}
