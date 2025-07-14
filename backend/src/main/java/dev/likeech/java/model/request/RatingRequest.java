package dev.likeech.java.model.request;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RatingRequest {
    private Long userId;
    private Long courseId;
    private Integer score;
    private String comment;
}
