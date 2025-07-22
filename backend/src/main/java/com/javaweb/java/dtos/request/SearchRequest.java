package com.javaweb.java.dtos.request;

public record SearchRequest(
        String field,
        String search,
        String order,
        String status,
        int page,
        int size
) {

}
