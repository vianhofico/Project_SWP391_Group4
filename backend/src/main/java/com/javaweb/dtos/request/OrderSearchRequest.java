package com.javaweb.dtos.request;

import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public record OrderSearchRequest(
        Double minPrice,

        Double maxPrice,

        String userName,

        String sortBy,

        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate startDate,

        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate endDate
) {
}
