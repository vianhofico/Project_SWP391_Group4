package com.javaweb.repositories;

import he.swp391_trial.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Integer> {
    List<Question> findByExam_ExamIdAndIsDeletedFalseOrderByCreatedAtAsc(Integer examId);
}