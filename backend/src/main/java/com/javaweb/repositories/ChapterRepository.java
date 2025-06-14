package com.javaweb.repositories;

import he.swp391_trial.entity.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChapterRepository extends JpaRepository<Chapter, Integer> {
    List<Chapter> findByCourse_CourseIdOrderByChapterOrderAsc(Integer courseId);
}