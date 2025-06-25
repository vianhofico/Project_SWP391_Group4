package dev.likeech.java.repository;

import dev.likeech.java.entity.LessonMainVideoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface LessonMainVideoRepository extends JpaRepository<LessonMainVideoEntity, Long> {
    List<LessonMainVideoEntity> findByIsDeleteTrueAndDeletedAtBefore(LocalDateTime time);
}
