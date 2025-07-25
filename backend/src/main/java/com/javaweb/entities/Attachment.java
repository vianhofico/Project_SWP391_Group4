package com.javaweb.entities;

import com.javaweb.enums.ResourceType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "attachments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attachment_id")
    private Long attachmentId;
    @Column(name = "url")
    private String url;
    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private ResourceType type;
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    @Column(name = "is_deleted")
    private Boolean isDeleted;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;
}

