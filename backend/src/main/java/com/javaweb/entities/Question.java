package com.javaweb.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private Long questionId;

    @Column(name = "content", columnDefinition = "NVARCHAR(MAX)")
    private String content;

    @Column(name = "question_type", length = 20)
    private String questionType;

    @Column(name = "option_a", columnDefinition = "NVARCHAR(MAX)")
    private String optionA;

    @Column(name = "option_b", columnDefinition = "NVARCHAR(MAX)")
    private String optionB;

    @Column(name = "option_c", columnDefinition = "NVARCHAR(MAX)")
    private String optionC;

    @Column(name = "option_d", columnDefinition = "NVARCHAR(MAX)")
    private String optionD;

    @Column(name = "correct_answer", columnDefinition = "NVARCHAR(MAX)")
    private String correctAnswer;

    @Column(name = "points")
    private Integer points;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "explanation", columnDefinition = "NVARCHAR(MAX)")
    private String explanation;

    @Column(name = "is_deleted")
    private Boolean isDeleted;

    @ManyToOne
    @JoinColumn(name = "exam_id")
    private Exam exam;

    @OneToMany(mappedBy = "question", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    private List<UserAnswer> userAnswers;
}
