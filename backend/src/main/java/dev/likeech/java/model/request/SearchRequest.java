package dev.likeech.java.model.request;

public record SearchRequest(
        String field,
        String search,
        String order,
        String status
) {

}
