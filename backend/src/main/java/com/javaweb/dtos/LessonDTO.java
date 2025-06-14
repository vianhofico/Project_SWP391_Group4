package com.javaweb.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LessonDTO {
    private Integer lessonId;

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must be less than 255 characters")
    private String title;

    @Size(max = 10000, message = "Description too long")
    private String description;

    private String videoUrl;

    @Min(value = 0, message = "Duration must be positive")
    private Integer duration;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @NotNull(message = "Course ID is required")
    private Integer courseId;

    @NotNull(message = "Chapter ID is required")
    private Integer chapterId;

    @NotNull(message = "Order is required")
    @Min(value = 1, message = "Order must be at least 1")
    private Integer order;

    private Boolean isPublished = true;
}