package dev.likeech.java.mapper;

import dev.likeech.java.entity.Lesson;
import dev.likeech.java.entity.LessonResource;
import dev.likeech.java.model.dto.LessonResourceDTO;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@RequiredArgsConstructor
@Component
public class ResourceDTOConverter {
    private final ModelMapper modelMapper;
    public LessonResourceDTO toDto(LessonResource lessonResource) {
        LessonResourceDTO lessonResourceDTO = modelMapper.map(lessonResource, LessonResourceDTO.class);
        lessonResourceDTO.setIsDeleted(lessonResource.getIsDeleted() ? "Inactive" : "Active");
        List<Long> lessonIds = lessonResource.getLessons().stream().
                map(Lesson::getLessonId).toList();
        lessonResourceDTO.setLessonIds(lessonIds);
        return lessonResourceDTO;
    }
}
