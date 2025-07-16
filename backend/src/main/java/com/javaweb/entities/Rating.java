package com.javaweb.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "ratings")  
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rating_id")  
    private Long ratingId;

    @Column(name = "rating")
    private Integer rating;

    @Lob
    @Column(name = "feedback")
    private String feedback;

    @Column(name = "created_at")  
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")  
    private User user;

    @ManyToOne
    @JoinColumn(name = "course_id")  
    private Course course;
}
