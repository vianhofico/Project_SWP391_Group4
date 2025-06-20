package dev.likeech.java.model.request;

import jakarta.validation.constraints.NotNull;

public record LessonReorderRequest(
        @NotNull(message = "lessonId cannot be null") Long lessonId,
        @NotNull(message = "lessonOrder cannot be null") Integer lessonOrder
) {
}
