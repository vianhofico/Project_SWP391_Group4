package dev.likeech.java.repository;

import dev.likeech.java.entity.AttachmentEntity;
import dev.likeech.java.entity.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


public interface AttachmentRepository extends JpaRepository<AttachmentEntity, Long> {
    List<AttachmentEntity> findByIsDeletedTrueAndDeletedAtBefore(LocalDateTime time);
    List<AttachmentEntity> findByCourse_CourseIdAndIsDeletedTrueAndType(Long courseId, ResourceType type);
    Optional<AttachmentEntity> findByAttachmentIdAndIsDeletedTrue(Long id);
}
