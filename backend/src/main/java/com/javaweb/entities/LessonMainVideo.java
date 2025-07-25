package com.javaweb.entities;

import com.javaweb.enums.ResourceType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "lesson_main_videos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonMainVideo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "main_video_id")
    private Long mainVideoId;
    @Column(name = "url")
    private String url;
    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private ResourceType type;
    @Column(name = "is_deleted")
    private Boolean isDelete;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;
}
