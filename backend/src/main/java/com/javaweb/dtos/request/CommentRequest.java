package com.javaweb.dtos.request;

import jakarta.validation.constraints.NotBlank;

public record CommentRequest(
        @NotBlank(message = "content cannot blank")
        String content,

        Long parentCommentId
) {
}
