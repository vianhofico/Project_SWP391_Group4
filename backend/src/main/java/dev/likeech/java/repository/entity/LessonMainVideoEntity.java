package dev.likeech.java.repository.entity;

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
public class LessonMainVideoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mainVideoId")
    private Long mainVideoId;
    @Column(name = "title")
    private String title;
    @Column(name ="url")
    private String url;
    @Column(name="duration")
    private Long duration;
    @Column(name = "isDeleted")
    private Boolean isdelete;
    @Column(name = "createdAt")
    private LocalDateTime createdAt;
    @Column(name ="deletedAt")
    private LocalDateTime deletedAt;
    @ManyToOne
    @JoinColumn(name = "lessonId")
    private LessonEntity lesson;
}
