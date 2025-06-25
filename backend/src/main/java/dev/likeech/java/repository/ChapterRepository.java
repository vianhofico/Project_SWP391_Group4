package dev.likeech.java.repository;

import dev.likeech.java.entity.ChapterEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChapterRepository extends JpaRepository<ChapterEntity, Long> {
    @Query("SELECT MAX(c.chapterOrder) FROM ChapterEntity c WHERE c.course.courseId = :courseId")
    Integer findMaxOrderByCourseId(@Param("courseId") Long courseId);
    Page<ChapterEntity> findByCourse_courseId(Long courseCourseId, Pageable pageable);
}
