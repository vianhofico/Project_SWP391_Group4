package com.javaweb.java.converter;

import com.javaweb.java.dtos.response.ChapterDTO;
import com.javaweb.java.entities.Chapter;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class ChapterDTOConverter {
    private final ModelMapper modelMapper;
    public ChapterDTO toChapterDTO(Chapter chapterEntity) {
        ChapterDTO chapterDTO = modelMapper.map(chapterEntity, ChapterDTO.class);
        chapterDTO.setStatus(chapterEntity.getStatus() ? "ACTIVE" : "INACTIVE");
        chapterDTO.setCourseId(chapterEntity.getCourse().getCourseId());
        return chapterDTO;
    }
}
