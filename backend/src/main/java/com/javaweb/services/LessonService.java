package com.javaweb.services;

import com.javaweb.dtos.request.LessonReorderRequest;
import com.javaweb.dtos.request.LessonRequest;
import com.javaweb.dtos.response.LessonDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface LessonService {
    LessonDTO createLesson(LessonRequest request, Long chapterId);
    List<LessonDTO> getLessons(Long chapterId);
    List<LessonDTO> reorderLessons(Long chapterId, List<LessonReorderRequest> request);
    LessonDTO updateLesson(Long lessonId, LessonRequest request);
    LessonDTO getLesson(Long lessonId);
    void deleteLesson(Long lessonId);
    Page<LessonDTO> getActiveLessons(Long chapterId,int page, int size);
    LessonDTO getLessonDetailForUser(Long lessonId, String username);
    List<LessonDTO> getActiveLessonsByChapterForUser(Long chapterId, Long userId);
}
