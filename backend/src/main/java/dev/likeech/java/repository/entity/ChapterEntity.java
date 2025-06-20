package dev.likeech.java.repository.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Chapters")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChapterEntity {
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
    private CourseEntity course;

    @Column(name = "title")
    private String title;

    @Column(name = "chapter_order")
    private Integer chapterOrder;

    @Column(name = "status")
    private Boolean status;

    @OneToMany(mappedBy = "chapter")
    private List<LessonEntity> lessons;
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
