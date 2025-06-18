package dev.likeech.java.model.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CourseIdsRequest {
    @NotNull(message = "courseIds can't be null")
    @Size(min = 1, message = "courseIds can't be empty")
    private List<@Positive(message = "Each courseId must be positive") Long> courseIds;
}
