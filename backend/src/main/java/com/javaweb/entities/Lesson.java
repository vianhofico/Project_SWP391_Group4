package com.javaweb.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "lessons")
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lesson_id")
    private Long lessonId;

    @ManyToOne
    @JoinColumn(name = "chapter_id")
    private Chapter chapter;

    @Column(name = "title")
    private String title;

    @Column(name = "content")
    private String content;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updateAt;
    @Column(name = "lesson_order")
    private Integer lessonOrder;

    @Column(name = "status")
    private Boolean status;
    @Column(name = "main_video_url")
    private String mainVideoUrl;
    @OneToMany(mappedBy = "lesson")
    private List<LessonMainVideo> mainVideos = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "lesson_resources_mapping",
            joinColumns = @JoinColumn(name = "lesson_id"),
            inverseJoinColumns = @JoinColumn(name = "resource_id")
    )
    private List<LessonResource> resources = new ArrayList<>();

    @OneToMany(mappedBy = "lesson")
    private List<Exam> exams = new ArrayList<>();

    @OneToMany(mappedBy = "lesson")
    private List<LessonProgress> lessonProgress = new ArrayList<>();

    @PrePersist
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updateAt = now;
    }

    @PreUpdate
    public void onUpdate() {
        this.updateAt = LocalDateTime.now();
    }
}
