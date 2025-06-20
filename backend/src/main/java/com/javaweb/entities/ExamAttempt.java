package com.javaweb.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "exam_attempts")
public class ExamAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attempt_id")
    private Long attemptId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "exam_id")
    private Exam exam;

    @Column(name = "attempt_number")
    private Integer attemptNumber;

    @Column(name = "total_score", precision = 10, scale = 2)
    private BigDecimal totalScore;

    @Column(name = "score_percent", precision = 5, scale = 2)
    private BigDecimal scorePercent;

    @Column(name = "is_passed")
    private Boolean isPassed;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "time_spent")
    private Integer timeSpent;

    @OneToMany(mappedBy = "attempt", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    List<UserAnswer> userAnswers;
}
