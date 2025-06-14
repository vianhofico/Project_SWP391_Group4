package com.javaweb.dtos;

import he.swp391_trial.entity.Question;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class QuestionDTO {
    private Integer questionId;

    @NotBlank(message = "Content is required")
    @Size(max = 10000, message = "Content too long")
    private String content;

    @NotNull(message = "Question type is required")
    private Question.QuestionType questionType;

    @Size(max = 1000, message = "Option too long")
    private String optionA;

    @Size(max = 1000, message = "Option too long")
    private String optionB;

    @Size(max = 1000, message = "Option too long")
    private String optionC;

    @Size(max = 1000, message = "Option too long")
    private String optionD;

    @NotBlank(message = "Correct answer is required")
    @Size(max = 1000, message = "Answer too long")
    private String correctAnswer;

    @Min(value = 1, message = "Points must be at least 1")
    private Integer points = 1;

    @NotNull(message = "Exam ID is required")
    private Integer examId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Size(max = 10000, message = "Explanation too long")
    private String explanation;

    private Boolean isDeleted = false;

}
