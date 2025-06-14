package com.javaweb.entities;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ExamAttempts")
public class ExamAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer attemptId;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "examId", nullable = false)
    private Exam exam;

    @Column(name = "attemptNumber", nullable = false)
    private Integer attemptNumber;

    @Column(name = "totalScore", nullable = false, precision = 5, scale = 2)
    private BigDecimal totalScore;

    @Column(name = "startedAt", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "completedAt")
    private LocalDateTime completedAt;

    @Column(name = "timeSpent")
    private Integer timeSpent; // in seconds

    // Getters and setters
    // Constructors
    // toString()
}
