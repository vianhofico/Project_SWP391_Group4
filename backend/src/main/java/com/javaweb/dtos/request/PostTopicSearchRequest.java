package com.javaweb.dtos.request;

import jakarta.validation.constraints.Pattern;

public record PostTopicSearchRequest(
        String name,
        @Pattern(regexp = "ASC|DESC", flags = Pattern.Flag.CASE_INSENSITIVE, message = "Sort order must be ASC or DESC")
        String sortOrder
) {
}
