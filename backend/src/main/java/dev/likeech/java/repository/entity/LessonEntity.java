package dev.likeech.java.repository.entity;

import io.grpc.stub.ServerCalls;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(name = "Lessons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lessonId")
    private Long lessonId;

    @ManyToOne
    @JoinColumn(name = "chapterId")
    private ChapterEntity chapter;

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
    private List<LessonMainVideoEntity> mainVideos;

    @ManyToMany
    @JoinTable(
            name = "lesson_resources_mapping",
            joinColumns = @JoinColumn(name = "lesson_Id"),
            inverseJoinColumns = @JoinColumn(name = "resource_Id")
    )
    private List<LessonResourceEntity> resources;
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
