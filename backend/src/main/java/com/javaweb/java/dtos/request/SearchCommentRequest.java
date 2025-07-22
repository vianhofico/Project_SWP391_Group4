package com.javaweb.java.dtos.request;

import jakarta.validation.constraints.Pattern;

public record SearchCommentRequest(

        String content,
        String userFullName,
        @Pattern(regexp = "ASC|DESC", flags = Pattern.Flag.CASE_INSENSITIVE, message = "Sort order must be ASC or DESC")
        String sortOrder,
        @Pattern(regexp = "ACTIVE|DELETED|", flags = Pattern.Flag.CASE_INSENSITIVE, message = "Invalid comment status")
        String status
) {
}
