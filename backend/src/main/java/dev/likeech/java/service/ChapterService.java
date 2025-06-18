package dev.likeech.java.service;

import dev.likeech.java.model.dto.ChapterDTO;
import dev.likeech.java.model.request.ChapterReorderRequest;


import java.util.List;

public interface ChapterService {
    List<ChapterDTO> createChapters(List<String> titles, Long courseId);
    List<ChapterDTO> getChapters(Long courseId);
    List<ChapterDTO> reorderChapters(Long courseId, List<ChapterReorderRequest> request);
    void updateChapterTitle(Long chapterId, String newTitle);
}
