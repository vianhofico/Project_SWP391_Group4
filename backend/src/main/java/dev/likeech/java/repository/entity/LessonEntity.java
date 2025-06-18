package dev.likeech.java.repository.entity;

import jakarta.persistence.*;
import lombok.*;

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

    @Column(name = "status")
    private Boolean status;

    @OneToMany(mappedBy = "lesson")
    private List<LessonResourceEntity> resources;
}
