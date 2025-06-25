package dev.likeech.java.service;

import dev.likeech.java.entity.AttachmentEntity;
import dev.likeech.java.entity.ResourceType;
import dev.likeech.java.model.dto.AttachmentDTO;

import java.util.List;

public interface AttachmentService {
    AttachmentEntity createImageAttachment(String url);
    AttachmentEntity createVideoAttachment(String url);
    AttachmentEntity createDocumentAttachment(String url);
    void cleanupOldDeletedAttachments();
    List<AttachmentDTO> getAttachments(Long courseId, ResourceType type);
    AttachmentEntity markAttachmentAsRecoverById(Long id);
}
