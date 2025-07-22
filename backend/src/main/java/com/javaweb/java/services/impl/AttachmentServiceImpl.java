package com.javaweb.java.services.impl;

import com.javaweb.java.converter.AttachmentDTOConverter;
import com.javaweb.java.dtos.response.AttachmentDTO;
import com.javaweb.java.repositories.AttachmentRepository;
import com.javaweb.java.repositories.GcsRepository;
import com.javaweb.java.entities.Attachment;
import com.javaweb.java.enums.ResourceType;
import com.javaweb.java.services.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttachmentServiceImpl implements AttachmentService {
    private final AttachmentRepository attachmentRepository;
    private final GcsRepository gcsRepository;
    private final AttachmentDTOConverter attachmentDTOConverter;
    private static final Logger log = LoggerFactory.getLogger(AttachmentServiceImpl.class);

    @Override
    @Transactional
    public Attachment createImageAttachment(String url) {
        return attachmentRepository.save(
                Attachment.builder()
                        .url(url)
                        .type(ResourceType.image)
                        .isDeleted(false)
                        .createdAt(LocalDateTime.now())
                        .build()
        );
    }

    @Override
    @Transactional
    public Attachment createVideoAttachment(String url) {
        return attachmentRepository.save(
                Attachment.builder()
                        .url(url)
                        .type(ResourceType.video)
                        .isDeleted(false)
                        .createdAt(LocalDateTime.now())
                        .build()
        );
    }

    @Override
    public Attachment createDocumentAttachment(String url) {
        return attachmentRepository.save(
                Attachment.builder()
                        .url(url)
                        .type(ResourceType.document)
                        .isDeleted(false)
                        .createdAt(LocalDateTime.now())
                        .build()
        );
    }
    @Override
    @Scheduled(cron = "0 0 3 * * *")
    public void cleanupOldDeletedAttachments() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(7);
        List<Attachment> attachments = attachmentRepository.findByIsDeletedTrueAndDeletedAtBefore(cutoff);
        for (Attachment attachment : attachments) {
            try {
                gcsRepository.deleteViaSignedUrl(attachment.getUrl());
                attachmentRepository.delete(attachment);
            } catch (Exception e) {
                log.error("Failed to delete attachment: {}", attachment.getUrl(), e);
            }
        }
    }
    @Override
    public List<AttachmentDTO> getAttachments(Long courseId, ResourceType type) {
        List<Attachment> attachmentEntities = attachmentRepository.findByCourse_CourseIdAndIsDeletedTrueAndType(courseId, type);
        List<AttachmentDTO> attachmentDTOs = new ArrayList<>();
        for(Attachment attachment : attachmentEntities) {
            AttachmentDTO attachmentDTO = attachmentDTOConverter.toDTO(attachment);
            attachmentDTOs.add(attachmentDTO);
        }
        return attachmentDTOs;
    }
    @Override
    @Transactional
    public Attachment markAttachmentAsRecoverById(Long id) {
        Attachment attachment = attachmentRepository.findByAttachmentIdAndIsDeletedTrue(id)
                .orElseThrow(() -> new IllegalArgumentException("Attachment not found or already deleted"));
        attachment.setIsDeleted(true);
        attachment.setDeletedAt(LocalDateTime.now());
        return attachmentRepository.save(attachment);
    }
}
