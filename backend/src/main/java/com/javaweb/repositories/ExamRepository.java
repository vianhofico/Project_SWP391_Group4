package com.javaweb.repositories;

import he.swp391_trial.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExamRepository extends JpaRepository<Exam, Integer> {
    List<Exam> findByLesson_LessonIdAndIsDeletedFalse(Integer lessonId);
    Optional<Exam> findByExamIdAndIsDeletedFalse(Integer examId);
}
