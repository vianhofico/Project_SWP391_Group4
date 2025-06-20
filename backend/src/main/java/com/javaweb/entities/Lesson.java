package com.javaweb.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
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
    @Column(name = "createdAt")
    private LocalDateTime createdAt;
    @Column(name = "updatedAt")
    private LocalDateTime updateAt;
    @Column(name = "lessonOrder")
    private Integer lessonOrder;

    @Column(name = "status")
    private Boolean status;
    @Column(name = "mainVideoUrl")
    private String mainVideoUrl;
    @OneToMany(mappedBy = "lesson")
    private List<LessonMainVideo> mainVideos;

    @ManyToMany
    @JoinTable(
            name = "lesson_resources_mapping",
            joinColumns = @JoinColumn(name = "lesson_id"),
            inverseJoinColumns = @JoinColumn(name = "resource_id")
    )
    private List<LessonResource> resources;

    @OneToMany(mappedBy = "lesson")
    private List<Exam> exams;

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
