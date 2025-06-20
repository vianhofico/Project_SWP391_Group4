package dev.likeech.java.repository;

import dev.likeech.java.repository.entity.LessonEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LessonRepository extends JpaRepository<LessonEntity, Long> {
    @Query("SELECT MAX(l.lessonOrder) FROM LessonEntity l WHERE l.chapter.chapterId = :chapterId")
    Integer findMaxOrderByCourseId(@Param("chapterId") Long chapterId);
    List<LessonEntity> findByChapter_chapterId(Long chapterId);
    List<LessonEntity> findByMainVideoUrl(String mainVideoUrl);
}
