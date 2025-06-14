package com.javaweb.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExamDTO {
    private Integer examId;

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must be less than 255 characters")
    private String title;

    @Size(max = 10000, message = "Description too long")
    private String description;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Min(value = 1, message = "Time limit must be at least 1 minute")
    private Integer timeLimit;

    @Min(value = 1, message = "Max attempts must be at least 1")
    private Integer maxAttempts = 1;

    @NotNull(message = "Course ID is required")
    private Integer courseId;

    @NotNull(message = "Chapter ID is required")
    private Integer chapterId;

    @NotNull(message = "Lesson ID is required")
    private Integer lessonId;

    private Boolean isPublished = true;
    private Boolean isDeleted = false;
}