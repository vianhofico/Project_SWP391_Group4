package com.javaweb.services.impl;

import com.javaweb.dtos.QuestionDTO;
import com.javaweb.entities.Exam;
import com.javaweb.entities.Question;
import com.javaweb.exceptions.ResourceNotFoundException;
import com.javaweb.repositories.QuestionRepository;

import com.javaweb.repositories.ExamRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class QuestionService {
    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ExamRepository examRepository;

    public List<Question> getQuestionsByExam(Integer examId) {
        return questionRepository.findByExam_ExamIdAndIsDeletedFalseOrderByCreatedAtAsc(examId);
    }

    public Question getQuestionById(Integer id) {
        return questionRepository.findById(id)
                .filter(q -> !q.getDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
    }

    public Question createQuestion(QuestionDTO questionDTO) {
        Question question = new Question();
        mapQuestionDTOToEntity(questionDTO, question);
        return questionRepository.save(question);
    }

    public Question updateQuestion(Integer id, QuestionDTO questionDTO) {
        Question question = getQuestionById(id);
        mapQuestionDTOToEntity(questionDTO, question);
        return questionRepository.save(question);
    }

    public void deleteQuestion(Integer id) {
        Question question = getQuestionById(id);
        question.setDeleted(true);
        questionRepository.save(question);
    }

    private void mapQuestionDTOToEntity(QuestionDTO dto, Question entity) {
        entity.setContent(dto.getContent());
        entity.setQuestionType(dto.getQuestionType());
        entity.setOptionA(dto.getOptionA());
        entity.setOptionB(dto.getOptionB());

        if (!"true_false".equalsIgnoreCase(String.valueOf(dto.getQuestionType()))) {
            entity.setOptionC(dto.getOptionC());
            entity.setOptionD(dto.getOptionD());
        } else {
            entity.setOptionC(null);
            entity.setOptionD(null);
        }

        entity.setCorrectAnswer(dto.getCorrectAnswer());
        entity.setPoints(dto.getPoints());
        entity.setExplanation(dto.getExplanation());

        Exam exam = examRepository.findById(dto.getExamId())
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + dto.getExamId()));
        entity.setExam(exam);
    }
}
