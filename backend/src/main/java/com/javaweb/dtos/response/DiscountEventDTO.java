package com.javaweb.dtos.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.javaweb.enums.DiscountType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class DiscountEventDTO {
    private Long id;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private DiscountType discountType;
    private double discountValue;
    private Long courseId;
    private String courseName;
    private String note;
}
