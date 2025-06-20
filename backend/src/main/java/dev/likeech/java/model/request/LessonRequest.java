package dev.likeech.java.model.request;

import jakarta.validation.constraints.NotBlank;

public record LessonRequest(
        @NotBlank(message = "Title cannot be blank") String title,
        @NotBlank(message = "Content cannot be blank") String content,
        @NotBlank(message ="main video url cannot be blank") String mainVideoUrl
) {
}
