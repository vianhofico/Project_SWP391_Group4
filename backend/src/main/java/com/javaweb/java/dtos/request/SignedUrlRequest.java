package com.javaweb.java.dtos.request;

import jakarta.validation.constraints.NotBlank;

public record SignedUrlRequest(
        @NotBlank(message = "objectName is required")
        String objectName,

        @NotBlank(message = "type is required")
        String type,

        @NotBlank(message = "folder is required")
        String folder
) {
}