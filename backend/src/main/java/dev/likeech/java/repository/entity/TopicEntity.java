package dev.likeech.java.repository.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "Topics")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "topicId")
    private Long topicId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "status", nullable = false)
    private Boolean status = true;  // true = ACTIVE, false = INACTIVE

    // Quan hệ Nhiều - Nhiều với CourseEntity thông qua bảng trung gian TopicCourses
    @ManyToMany
    @JoinTable(
            name = "Course_Topic",
            joinColumns = @JoinColumn(name = "topicId"),
            inverseJoinColumns = @JoinColumn(name = "courseId")
    )
    private List<CourseEntity> courses;
}
