package com.javaweb.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SignedUrlRequest(
        @NotBlank(message = "objectName is required")
        String objectName,

        @NotNull(message = "type is required")
        String type,

        @NotBlank(message = "folder is required")
        String folder
) {
}