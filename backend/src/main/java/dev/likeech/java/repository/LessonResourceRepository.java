package dev.likeech.java.repository;

import dev.likeech.java.entity.LessonEntity;
import dev.likeech.java.entity.LessonResourceEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;


public interface LessonResourceRepository extends JpaRepository<LessonResourceEntity, Long> {
   List<LessonResourceEntity> findByIsDeletedTrueAndDeletedAtBefore(LocalDateTime localDateTime);
   @Query("SELECT r FROM LessonResourceEntity r JOIN r.lessons l WHERE l.lessonId = :lessonId")
   Page<LessonResourceEntity> findByLessonId(Long lessonId, Pageable pageable);

   @Query("SELECT r FROM LessonResourceEntity r WHERE :lesson NOT MEMBER OF r.lessons")
   Page<LessonResourceEntity> findNotInLesson(@Param("lesson") LessonEntity lesson, Pageable pageable);
}
