package dev.likeech.java.mapper;

import dev.likeech.java.entity.LessonResourceEntity;
import dev.likeech.java.model.dto.LessonDTO;
import dev.likeech.java.entity.LessonEntity;
import dev.likeech.java.entity.LessonMainVideoEntity;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@RequiredArgsConstructor
@Component
public class LessonDTOConverter {
    private final ModelMapper modelMapper;
    public LessonDTO toLessonDTO(LessonEntity lessonEntity) {
        LessonDTO lessonDTO = modelMapper.map(lessonEntity, LessonDTO.class);
        lessonDTO.setStatus(lessonEntity.getStatus() ? "Active" : "Inactive");
        lessonDTO.setChapterId(lessonEntity.getChapter().getChapterId());
        lessonDTO.setMainVideoUrl(lessonEntity.getMainVideoUrl());
        List<Long> mainVideoIds =lessonEntity.getMainVideos().stream()
                .map(LessonMainVideoEntity::getMainVideoId).toList();
        List<Long> resourceIds = lessonEntity.getResources().stream()
                        .map(LessonResourceEntity::getResourceId).toList();
        lessonDTO.setResourceIds(resourceIds);
        lessonDTO.setMainVideoIds(mainVideoIds);
        return lessonDTO;
    }
}
