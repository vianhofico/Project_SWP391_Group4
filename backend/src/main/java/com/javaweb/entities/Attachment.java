package com.javaweb.entities;

import com.javaweb.enums.ResourceType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

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

    @Column(name = "isDeleted")
    private Boolean isDeleted;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    @ManyToMany
    @JoinTable(
            name = "course_attachment",
            joinColumns = @JoinColumn(name = "attachment_id"),
            inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private List<Attachment> attachments;
}
