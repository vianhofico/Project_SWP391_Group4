package dev.likeech.java.service;

import dev.likeech.java.entity.Attachment;
import dev.likeech.java.enums.ResourceType;
import dev.likeech.java.model.dto.AttachmentDTO;

import java.util.List;

public interface AttachmentService {
    Attachment createImageAttachment(String url);
    Attachment createVideoAttachment(String url);
    Attachment createDocumentAttachment(String url);
    void cleanupOldDeletedAttachments();
    List<AttachmentDTO> getAttachments(Long courseId, ResourceType type);
    Attachment markAttachmentAsRecoverById(Long id);
}
