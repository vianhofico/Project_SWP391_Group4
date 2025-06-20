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
@Table(name = "scores")  
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "score_id")  
    private Long scoreId;

    @Column(name = "attempt_count")  
    private Integer attemptCount;

    @Column(name = "score")
    private Float score;

    @Column(name = "taken_at")  
    private LocalDateTime takenAt;

    @ManyToOne
    @JoinColumn(name = "user_id")  
    private User user;

    @ManyToOne
    @JoinColumn(name = "exam_id")  
    private Exam exam;
}
