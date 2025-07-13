package com.javaweb.dtos.request;

import jakarta.validation.constraints.Pattern;

public record PostSearchRequest(
        @Pattern(regexp = "^$|^[1-9]\\d*$", message = "postTopicId must be empty or a positive integer")
        String postTopicId,
        String title,
        @Pattern(regexp = "DELETED|ACTIVE", flags = Pattern.Flag.CASE_INSENSITIVE, message = "status must be DELETED or ACTIVE")
        String status,
        @Pattern(regexp = "ASC|DESC", flags = Pattern.Flag.CASE_INSENSITIVE, message = "Sort order must be ASC or DESC")
        String sortOrder
) {
}
