package dev.likeech.java.service;

import dev.likeech.java.model.dto.LessonDTO;
import dev.likeech.java.model.request.LessonReorderRequest;
import dev.likeech.java.model.request.LessonRequest;

import java.util.List;

public interface LessonService {
    LessonDTO createLesson(LessonRequest request, Long chapterId);
    List<LessonDTO> getLessons(Long chapterId);
    List<LessonDTO> reorderLessons(Long chapterId, List<LessonReorderRequest> request);
    LessonDTO updateLesson(Long lessonId, LessonRequest request);
}
