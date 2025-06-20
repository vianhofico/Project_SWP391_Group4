package dev.likeech.java.repository.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "LessonResources")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonResourceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resourceId")
    private Long resourceId;

    @ManyToMany
    @JoinTable(
            name = "lesson_resources_mapping",
            joinColumns = @JoinColumn(name = "resource_id"),
            inverseJoinColumns = @JoinColumn(name = "lesson_id")
    )
    private List<LessonEntity> lessons;

    @Column(name = "title")
    private String title;

    @Column(name = "url")
    private String url;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private ResourceType type;

    @Column(name = "isDeleted")
    private Boolean isDeleted;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

}

