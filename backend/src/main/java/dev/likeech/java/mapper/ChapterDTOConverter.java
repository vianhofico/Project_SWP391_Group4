package dev.likeech.java.mapper;

import dev.likeech.java.model.dto.ChapterDTO;
import dev.likeech.java.model.dto.CourseDTO;
import dev.likeech.java.repository.entity.ChapterEntity;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.mapper.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class ChapterDTOConverter {
    private final ModelMapper modelMapper;
    public ChapterDTO toChapterDTO(ChapterEntity chapterEntity) {
        ChapterDTO chapterDTO = modelMapper.map(chapterEntity, ChapterDTO.class);
        chapterDTO.setStatus(chapterEntity.getStatus() ? "Active" : "Inactive");
        chapterDTO.setCourseId(chapterEntity.getCourse().getCourseId());
        return chapterDTO;
    }
}
