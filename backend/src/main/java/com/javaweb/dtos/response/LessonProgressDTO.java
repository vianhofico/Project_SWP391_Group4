package com.javaweb.dtos.response;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class LessonProgressDTO {
    private Long id;
    private Long userId;
    private Long lessonId;
    private Boolean isCompleted;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}
