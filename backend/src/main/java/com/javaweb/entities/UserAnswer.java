package com.javaweb.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "user_answers")
public class UserAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_id")
    private Long answerId;

    @ManyToOne
    @JoinColumn(name = "attempt_id")
    private ExamAttempt attempt;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    @Column(name = "user_answer", columnDefinition = "NVARCHAR(MAX)")
    private String userAnswer;

    @Column(name = "is_correct")
    private Boolean isCorrect;

    @Column(name = "points_earned", precision = 5, scale = 2)
    private BigDecimal pointsEarned;

    @Column(name = "time_spent")
    private Integer timeSpent;

    @Column(name = "feedback", columnDefinition = "NVARCHAR(MAX)")
    private String feedback;
}
