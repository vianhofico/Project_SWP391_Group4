package dev.likeech.java.service;

import dev.likeech.java.repository.entity.AttachmentEntity;

public interface AttachmentService {
    AttachmentEntity createImageAttachment(String url);
    AttachmentEntity createVideoAttachment(String url);
    AttachmentEntity createDocumentAttachment(String url);
    void cleanupOldDeletedAttachments();
}
