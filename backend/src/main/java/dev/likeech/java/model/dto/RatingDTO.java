package dev.likeech.java.model.dto;
import lombok.*;
import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RatingDTO {
    private Long ratingId;
    private Long userId;
    private Long courseId;
    private Integer score;
    private String comment;
    private LocalDateTime createdAt;
}
