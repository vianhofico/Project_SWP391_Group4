package dev.likeech.java.mapper;

import dev.likeech.java.model.dto.AttachmentDTO;
import dev.likeech.java.entity.AttachmentEntity;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class AttachmentDTOConverter {
    private final ModelMapper modelMapper;
    public AttachmentDTO toDTO(AttachmentEntity attachment) {
        AttachmentDTO attachmentDTO = modelMapper.map(attachment, AttachmentDTO.class);
        attachmentDTO.setIsDeleted(attachment.getIsDeleted() ? "Inactive" : "Active");
        attachmentDTO.setUrl(attachment.getUrl());
        return attachmentDTO;
    }
}
