package com.javaweb.dtos.request;

import jakarta.validation.constraints.Pattern;

public record CommentSearchRequest(

        String content,
        String userFullName,
        @Pattern(regexp = "ASC|DESC", flags = Pattern.Flag.CASE_INSENSITIVE, message = "Sort order must be ASC or DESC")
        String sortOrder
) {
}
