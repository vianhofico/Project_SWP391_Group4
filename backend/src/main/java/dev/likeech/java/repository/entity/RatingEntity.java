package dev.likeech.java.repository.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "Ratings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ratingId")
    private Long ratingId;

    @ManyToOne
    @JoinColumn(name = "userId")
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "courseId")
    private CourseEntity course;

    @Column(name = "score")
    private Integer score;

    @Column(name = "comment")
    private String comment;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;
}

