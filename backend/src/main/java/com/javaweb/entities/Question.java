package com.javaweb.entities;


import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer questionId;

    @Column(name = "content", nullable = false, length = Integer.MAX_VALUE,columnDefinition = "NVARCHAR(250)")
    private String content;

    @Column(name = "question_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private QuestionType questionType;

    @Column(name = "optiona", length = Integer.MAX_VALUE,columnDefinition = "NVARCHAR(250)")
    private String optionA;

    @Column(name = "optionb", length = Integer.MAX_VALUE,columnDefinition = "NVARCHAR(250)")
    private String optionB;

    @Column(name = "optionc", length = Integer.MAX_VALUE,columnDefinition = "NVARCHAR(250)")
    private String optionC;

    @Column(name = "optiond", length = Integer.MAX_VALUE,columnDefinition = "NVARCHAR(250)")
    private String optionD;

    @Column(name = "correct_answer", length = Integer.MAX_VALUE,columnDefinition = "NVARCHAR(250)")
    private String correctAnswer;

    @Column(name = "points")
    private Integer points = 1;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "explanation", length = Integer.MAX_VALUE)
    private String explanation;

    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

    @ManyToOne
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public QuestionType getQuestionType() {
        return questionType;
    }

    public void setQuestionType(QuestionType questionType) {
        this.questionType = questionType;
    }

    public String getOptionA() {
        return optionA;
    }

    public void setOptionA(String optionA) {
        this.optionA = optionA;
    }

    public String getOptionB() {
        return optionB;
    }

    public void setOptionB(String optionB) {
        this.optionB = optionB;
    }

    public String getOptionC() {
        return optionC;
    }

    public void setOptionC(String optionC) {
        this.optionC = optionC;
    }

    public String getOptionD() {
        return optionD;
    }

    public void setOptionD(String optionD) {
        this.optionD = optionD;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public Boolean getDeleted() {
        return isDeleted;
    }

    public void setDeleted(Boolean deleted) {
        isDeleted = deleted;
    }

    public Exam getExam() {
        return exam;
    }

    public void setExam(Exam exam) {
        this.exam = exam;
    }


    public enum QuestionType {
        multiple_choice, true_false
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
