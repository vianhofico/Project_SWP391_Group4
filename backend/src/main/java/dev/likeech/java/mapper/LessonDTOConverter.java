package dev.likeech.java.mapper;

import dev.likeech.java.model.dto.ChapterDTO;
import dev.likeech.java.model.dto.LessonDTO;
import dev.likeech.java.repository.entity.ChapterEntity;
import dev.likeech.java.repository.entity.LessonEntity;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class LessonDTOConverter {
    private final ModelMapper modelMapper;
    public LessonDTO toLessonDTO(LessonEntity lessonEntity) {
        LessonDTO lessonDTO = modelMapper.map(lessonEntity, LessonDTO.class);
        lessonDTO.setStatus(lessonEntity.getStatus() ? "Active" : "Inactive");
        lessonDTO.setChapterId(lessonEntity.getChapter().getChapterId());
        lessonDTO.setMainVideoUrl(lessonEntity.getMainVideoUrl());
        return lessonDTO;
    }
}
