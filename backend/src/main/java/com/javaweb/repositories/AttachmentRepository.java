package com.javaweb.repositories;

import com.javaweb.entities.Attachment;
import com.javaweb.enums.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    List<Attachment> findByIsDeletedTrueAndDeletedAtBefore(LocalDateTime time);
    List<Attachment> findByCourse_CourseIdAndIsDeletedTrueAndType(Long courseId, ResourceType type);
    Optional<Attachment> findByAttachmentIdAndIsDeletedTrue(Long id);
}
