package dev.likeech.java.model.request;

public record SearchCourseRequest(
        String field,
        String search,
        String order,
        String status,
        int page,
        int size,
        Long topicId
) {
}
