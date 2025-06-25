package dev.likeech.java.mapper;

import dev.likeech.java.entity.LessonEntity;
import dev.likeech.java.entity.LessonResourceEntity;
import dev.likeech.java.model.dto.LessonResourceDTO;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Component
public class ResourceDTOConverter {
    private final ModelMapper modelMapper;
    public LessonResourceDTO toDto(LessonResourceEntity lessonResourceEntity) {
        LessonResourceDTO lessonResourceDTO = modelMapper.map(lessonResourceEntity, LessonResourceDTO.class);
        lessonResourceDTO.setIsDeleted(lessonResourceEntity.getIsDeleted() ? "Inactive" : "Active");
        List<Long> lessonIds = lessonResourceEntity.getLessons().stream().
                map(LessonEntity::getLessonId).toList();
        lessonResourceDTO.setLessonIds(lessonIds);
        return lessonResourceDTO;
    }
}
