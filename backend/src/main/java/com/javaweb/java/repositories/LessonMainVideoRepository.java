package com.javaweb.java.repositories;

import com.javaweb.java.entities.LessonMainVideo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface LessonMainVideoRepository extends JpaRepository<LessonMainVideo, Long> {
    List<LessonMainVideo> findByIsDeleteTrueAndDeletedAtBefore(LocalDateTime time);
}
