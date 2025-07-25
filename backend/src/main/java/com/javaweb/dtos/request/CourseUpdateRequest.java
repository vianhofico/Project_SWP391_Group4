package com.javaweb.dtos.request;


public record CourseUpdateRequest(
        String title,
        String description,
        Long price,
        String imageUrl,
        String videoTrialUrl,
        String status
) {}
