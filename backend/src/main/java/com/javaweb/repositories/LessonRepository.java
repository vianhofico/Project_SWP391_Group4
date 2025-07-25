package com.javaweb.repositories;

import com.javaweb.entities.Lesson;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
    @Query("SELECT MAX(l.lessonOrder) FROM Lesson l WHERE l.chapter.chapterId = :chapterId")
    Integer findMaxOrderByCourseId(@Param("chapterId") Long chapterId);
    List<Lesson> findByChapter_chapterId(Long chapterId);
    boolean existsByMainVideoUrlAndLessonIdNot(String mainVideoUrl, Long id);
    boolean existsByMainVideoUrl(String mainVideoUrl);
    Page<Lesson> findByChapter_chapterIdAndStatusTrue(Long chapterId, Pageable pageable);
    List<Lesson>findByChapter_ChapterIdAndStatusTrueOrderByLessonOrderAsc(Long chapterId);
    List<Lesson> findByChapter_Course_CourseIdAndStatusTrue(Long courseId);
}
