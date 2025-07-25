package com.javaweb.services;

import com.javaweb.dtos.response.AttachmentDTO;
import com.javaweb.entities.Attachment;
import com.javaweb.enums.ResourceType;

import java.util.List;

public interface AttachmentService {
    Attachment createImageAttachment(String url);
    Attachment createVideoAttachment(String url);
    Attachment createDocumentAttachment(String url);
    void cleanupOldDeletedAttachments();
    List<AttachmentDTO> getAttachments(Long courseId, ResourceType type);
    Attachment markAttachmentAsRecoverById(Long id);
}
