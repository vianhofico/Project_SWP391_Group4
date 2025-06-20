package com.javaweb.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "chapters")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chapter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chapterId")
    private Long chapterId;

    @Column(name = "created_At")
    private LocalDateTime createdAt;

    @Column(name = "updated_At")
    private LocalDateTime updateAt;

    @ManyToOne
    @JoinColumn(name = "courseId")
    private Course course;

    @OneToMany(mappedBy = "chapter", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    private List<Exam> exams;

    @Column(name = "title")
    private String title;

    @Column(name = "chapter_order")
    private Integer chapterOrder;

    @Column(name = "status")
    private Boolean status;

    @OneToMany(mappedBy = "chapter")
    private List<Lesson> lessons;

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
