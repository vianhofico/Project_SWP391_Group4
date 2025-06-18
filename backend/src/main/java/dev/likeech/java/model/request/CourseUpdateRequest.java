package dev.likeech.java.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CourseUpdateRequest(
        @NotBlank(message = "Title cannot be blank") String title,
        @NotBlank(message = "Description cannot be blank") String description,
        @NotNull(message = "Price cannot be null") Long price,
        @NotBlank(message = "Image URL cannot be blank") String imageUrl,
        @NotBlank(message = "Video Trial URL cannot be blank") String videoTrialUrl,
        @NotBlank(message = "Status cannot be blank")String status
) {}
