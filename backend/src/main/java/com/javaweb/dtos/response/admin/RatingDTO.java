package com.javaweb.dtos.response.admin;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@ToString(exclude = {"course"})
public class RatingDTO {

    private Long ratingId;
    private Integer rating;
    private String feedback;
    private String createdAt;
    private CourseDTO course;
}
