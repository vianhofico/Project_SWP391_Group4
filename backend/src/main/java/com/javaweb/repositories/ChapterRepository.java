package com.javaweb.repositories;

import com.javaweb.entities.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChapterRepository extends JpaRepository<Chapter, Integer> {
    List<Chapter> findByCourse_CourseIdOrderByChapterOrderAsc(Integer courseId);
}