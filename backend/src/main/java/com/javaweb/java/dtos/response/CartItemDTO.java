package com.javaweb.java.dtos.response;

import lombok.Data;

@Data
public class CartItemDTO {
    private Long cartItemId;
    private Double price;
    private CourseSummaryDTO course;
}
