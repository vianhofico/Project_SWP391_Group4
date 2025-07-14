package dev.likeech.java.repository;

import dev.likeech.java.entity.LessonMainVideo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface LessonMainVideoRepository extends JpaRepository<LessonMainVideo, Long> {
    List<LessonMainVideo> findByIsDeleteTrueAndDeletedAtBefore(LocalDateTime time);
}
