package com.javaweb.repositories;

import com.javaweb.entities.Lesson;
import com.javaweb.entities.LessonResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;


public interface LessonResourceRepository extends JpaRepository<LessonResource, Long> {
   List<LessonResource> findByIsDeletedTrueAndDeletedAtBefore(LocalDateTime localDateTime);
   @Query("SELECT r FROM LessonResource r JOIN r.lessons l WHERE l.lessonId = :lessonId")
   Page<LessonResource> findByLessonId(Long lessonId, Pageable pageable);

   @Query("SELECT r FROM LessonResource r WHERE :lesson NOT MEMBER OF r.lessons")
   Page<LessonResource> findNotInLesson(@Param("lesson") Lesson lesson, Pageable pageable);
}
