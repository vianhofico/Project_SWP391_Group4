package com.javaweb.java.entities;

import com.javaweb.java.enums.ResourceType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "LessonMainVideos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonMainVideo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mainVideoId")
    private Long mainVideoId;
    @Column(name ="url")
    private String url;
    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private ResourceType type;
    @Column(name = "isDeleted")
    private Boolean isDelete;
    @Column(name = "createdAt")
    private LocalDateTime createdAt;
    @Column(name ="deletedAt")
    private LocalDateTime deletedAt;
    @ManyToOne
    @JoinColumn(name = "lessonId")
    private Lesson lesson;
}
