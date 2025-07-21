package dev.likeech.java.model.dto;
import dev.likeech.java.enums.ResourceType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class LessonResourceDTO {
    private Long resourceId;
    private String title;
    private String url;
    private ResourceType type;
    private String isDeleted;
    private LocalDateTime createdAt;
    private List<Long> lessonIds;
}
