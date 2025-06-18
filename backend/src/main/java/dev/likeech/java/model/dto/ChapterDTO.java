package dev.likeech.java.model.dto;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ChapterDTO {
    private Long chapterId;
    private String title;
    private Integer chapterOrder;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updateAt;
    private Long courseId;
}
