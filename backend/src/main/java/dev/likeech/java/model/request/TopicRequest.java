package dev.likeech.java.model.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class TopicRequest {
    @NotNull(message = "topic name cannot be null")
    private String name;
    private String description;
    private String status;
}
