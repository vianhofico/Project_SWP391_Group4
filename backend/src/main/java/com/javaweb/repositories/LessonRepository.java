package com.javaweb.repositories;

import he.swp391_trial.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Integer> {
    List<Lesson> findByChapter_ChapterIdOrderByLessonOrderAsc(Integer chapterId);
    List<Lesson> findByCourse_CourseId(Integer courseId);
}