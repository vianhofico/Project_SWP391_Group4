package com.javaweb.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PostRequest(
        @NotBlank(message = "title cannot blank")
        String title,
        @NotBlank(message = "content cannot blank")
        String content,
        @NotNull(message = "invalid post topic")
        @Positive(message = "invalid post topic")
        Long postTopicId
) {
}
