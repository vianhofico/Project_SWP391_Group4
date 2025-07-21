package dev.likeech.java.model.request;

import dev.likeech.java.enums.ResourceType;
import jakarta.validation.constraints.NotBlank;

public record ResourceCreateRequest(
        @NotBlank(message = "Url can not be blank") String url,
        @NotBlank(message = "type can not be blank") ResourceType type,
        @NotBlank(message = "title can not be blank") String title
) {
}
