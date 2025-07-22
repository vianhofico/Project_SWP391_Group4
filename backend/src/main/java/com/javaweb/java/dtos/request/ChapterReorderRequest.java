package com.javaweb.java.dtos.request;

import jakarta.validation.constraints.NotNull;

public record ChapterReorderRequest(
        @NotNull(message = "chapterId cannot be null") Long chapterId,
        @NotNull(message = "chapterOrder cannot be null") Integer chapterOrder
) {
}
