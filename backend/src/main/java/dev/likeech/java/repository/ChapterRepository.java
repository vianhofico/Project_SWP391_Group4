package dev.likeech.java.repository;

import dev.likeech.java.entity.Chapter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChapterRepository extends JpaRepository<Chapter, Long> {
    @Query("SELECT MAX(c.chapterOrder) FROM Chapter c WHERE c.course.courseId = :courseId")
    Integer findMaxOrderByCourseId(@Param("courseId") Long courseId);
    Page<Chapter> findByCourse_courseId(Long courseCourseId, Pageable pageable);
    Page<Chapter> findByCourse_courseIdAndStatusTrue(Long courseId, Pageable pageable);
    List<Chapter> findByCourse_CourseIdOrderByChapterOrderAsc(Long courseId);
}
