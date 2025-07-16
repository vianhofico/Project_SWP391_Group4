package com.javaweb.dtos.response.admin;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.javaweb.dtos.response.client.CourseDTO;
import com.javaweb.dtos.response.client.CourseSummaryDTO;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@ToString(exclude = {"course"})
public class OrderItemDTO {

    private Long orderItemId;
    private Long price;
//    private CourseDTO course;
    private CourseSummaryDTO course;
}
