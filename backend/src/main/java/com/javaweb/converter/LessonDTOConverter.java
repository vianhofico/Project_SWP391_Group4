package com.javaweb.converter;

import com.javaweb.dtos.response.LessonDTO;
import com.javaweb.entities.Lesson;
import com.javaweb.entities.LessonMainVideo;
import com.javaweb.entities.LessonProgress;
import com.javaweb.entities.LessonResource;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@RequiredArgsConstructor
@Component
public class LessonDTOConverter {
    private final ModelMapper modelMapper;
    private final LessonProgressDTOConverter lessonProgressDTOConverter;

    public LessonDTO toLessonDTO(Lesson lesson) {
        return toLessonDTO(lesson, null);
    }
    public LessonDTO toLessonDTO(Lesson lesson, LessonProgress progress) {
        LessonDTO lessonDTO = modelMapper.map(lesson, LessonDTO.class);
        lessonDTO.setStatus(lesson.getStatus() ? "Active" : "Inactive");
        lessonDTO.setChapterId(lesson.getChapter().getChapterId());
        lessonDTO.setMainVideoUrl(lesson.getMainVideoUrl());

        List<Long> mainVideoIds = lesson.getMainVideos().stream()
                .map(LessonMainVideo::getMainVideoId)
                .toList();
        lessonDTO.setMainVideoIds(mainVideoIds);

        List<Long> resourceIds = lesson.getResources().stream()
                .map(LessonResource::getResourceId)
                .toList();
        lessonDTO.setResourceIds(resourceIds);
        lessonDTO.setIsCompleted(progress != null && Boolean.TRUE.equals(progress.getIsCompleted()));
        return lessonDTO;
    }
}
