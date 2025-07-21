package dev.likeech.java.model.dto;

import lombok.Data;

@Data
public class CartItemDTO {
    private Long cartItemId;
    private Double price;
    private CourseSummaryDTO course;
}
