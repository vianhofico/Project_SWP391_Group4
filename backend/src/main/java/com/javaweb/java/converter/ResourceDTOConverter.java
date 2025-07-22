package com.javaweb.java.converter;

import com.javaweb.java.entities.Lesson;
import com.javaweb.java.entities.LessonResource;
import com.javaweb.java.dtos.response.LessonResourceDTO;
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
