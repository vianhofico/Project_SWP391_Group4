package dev.likeech.java.entity;

import dev.likeech.java.enums.ResourceType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "LessonResources")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonResource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resourceId")
    private Long resourceId;

    @ManyToMany(mappedBy = "resources")
    private List<Lesson> lessons = new ArrayList<>();


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
    @Column(name ="deletedAt")
    private LocalDateTime deletedAt;
}

