package com.javaweb.java.converter;

import com.javaweb.java.entities.LessonProgress;
import com.javaweb.java.dtos.response.LessonProgressDTO;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class LessonProgressDTOConverter {
    private final ModelMapper modelMapper;
    public LessonProgressDTO toDTO(LessonProgress lessonProgress) {
        LessonProgressDTO dto = new LessonProgressDTO();
        dto.setLessonId(lessonProgress.getLesson().getLessonId());
        dto.setUserId(lessonProgress.getUser().getUserId());
        dto.setCompletedAt(lessonProgress.getCompletedAt());
        dto.setStartedAt(lessonProgress.getStartedAt());
        dto.setId(lessonProgress.getLessonProgressId());
        dto.setIsCompleted(lessonProgress.getIsCompleted());
        return dto;
    }
}
