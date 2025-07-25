package com.javaweb.dtos.request;

import com.javaweb.enums.ResourceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ResourceCreateRequest(
        @NotBlank(message = "Url can not be blank") String url,
        @NotNull(message = "type can not be blank") ResourceType type,
        @NotBlank(message = "title can not be blank") String title
) {
}
