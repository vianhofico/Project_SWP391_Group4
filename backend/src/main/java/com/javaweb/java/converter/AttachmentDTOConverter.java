package com.javaweb.java.converter;

import com.javaweb.java.dtos.response.AttachmentDTO;
import com.javaweb.java.entities.Attachment;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class AttachmentDTOConverter {
    private final ModelMapper modelMapper;
    public AttachmentDTO toDTO(Attachment attachment) {
        AttachmentDTO attachmentDTO = modelMapper.map(attachment, AttachmentDTO.class);
        attachmentDTO.setIsDeleted(attachment.getIsDeleted() ? "Inactive" : "Active");
        attachmentDTO.setUrl(attachment.getUrl());
        return attachmentDTO;
    }
}
