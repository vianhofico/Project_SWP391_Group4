package com.javaweb.java.dtos.response;

import com.javaweb.java.enums.ResourceType;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AttachmentDTO {
    private Long attachmentId;
    private String url;
    private ResourceType type;
    private LocalDateTime deletedAt;
    private String isDeleted;
    private LocalDateTime createdAt;
    private Long courseId;
}
