package dev.likeech.java.repository;

import dev.likeech.java.repository.entity.AttachmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;


public interface AttachmentRepository extends JpaRepository<AttachmentEntity, Long> {
    List<AttachmentEntity> findByIsDeletedTrueAndDeletedAtBefore(LocalDateTime time);
}
