package com.javaweb.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Answers")
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answerId")
    private Long answerId;

    @Column(name = "correctOption")
    private Character correctOption;

    @ManyToOne
    @JoinColumn(name = "questionId")
    private Question question;


    public Long getAnswerId() {
        return answerId;
    }

    public void setAnswerId(Long answerId) {
        this.answerId = answerId;
    }

    public Character getCorrectOption() {
        return correctOption;
    }

    public void setCorrectOption(Character correctOption) {
        this.correctOption = correctOption;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }
}
