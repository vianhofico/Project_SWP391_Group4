package dev.likeech.java.mapper;

import dev.likeech.java.entity.LessonProgress;
import dev.likeech.java.model.dto.LessonProgressDTO;
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
