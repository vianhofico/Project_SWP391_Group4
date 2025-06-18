package dev.likeech.java.repository.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Attachments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttachmentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attachmentId")
    private Long attachmentId;

    @Column(name = "url")
    private String url;
    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private ResourceType type;
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    @Column(name = "isDeleted")
    private Boolean isDeleted;
    @Column(name = "createdAt")
    private LocalDateTime createdAt;
}

