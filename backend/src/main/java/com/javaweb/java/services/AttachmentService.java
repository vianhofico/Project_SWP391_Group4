package com.javaweb.java.services;

import com.javaweb.java.entities.Attachment;
import com.javaweb.java.enums.ResourceType;
import com.javaweb.java.dtos.response.AttachmentDTO;

import java.util.List;

public interface AttachmentService {
    Attachment createImageAttachment(String url);
    Attachment createVideoAttachment(String url);
    Attachment createDocumentAttachment(String url);
    void cleanupOldDeletedAttachments();
    List<AttachmentDTO> getAttachments(Long courseId, ResourceType type);
    Attachment markAttachmentAsRecoverById(Long id);
}
