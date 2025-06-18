package dev.likeech.java.service.impl;

import dev.likeech.java.repository.AttachmentRepository;
import dev.likeech.java.repository.GcsRepository;
import dev.likeech.java.repository.entity.AttachmentEntity;
import dev.likeech.java.repository.entity.ResourceType;
import dev.likeech.java.service.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttachmentServiceImpl implements AttachmentService {
    private final AttachmentRepository attachmentRepository;
    private final GcsRepository gcsRepository;
    private static final Logger log = LoggerFactory.getLogger(AttachmentServiceImpl.class);

    @Override
    @Transactional
    public AttachmentEntity createImageAttachment(String url) {
        return attachmentRepository.save(
                AttachmentEntity.builder()
                        .url(url)
                        .type(ResourceType.image)
                        .isDeleted(false)
                        .createdAt(LocalDateTime.now())
                        .build()
        );
    }

    @Override
    @Transactional
    public AttachmentEntity createVideoAttachment(String url) {
        return attachmentRepository.save(
                AttachmentEntity.builder()
                        .url(url)
                        .type(ResourceType.video)
                        .isDeleted(false)
                        .createdAt(LocalDateTime.now())
                        .build()
        );
    }

    @Override
    public AttachmentEntity createDocumentAttachment(String url) {
        return attachmentRepository.save(
                AttachmentEntity.builder()
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
        List<AttachmentEntity> attachments = attachmentRepository.findByIsDeletedTrueAndDeletedAtBefore(cutoff);
        for (AttachmentEntity attachment : attachments) {
            try {
                gcsRepository.deleteViaSignedUrl(attachment.getUrl());
                attachmentRepository.delete(attachment);
            } catch (Exception e) {
                log.error("Failed to delete attachment: {}", attachment.getUrl(), e);
            }
        }
    }
}
