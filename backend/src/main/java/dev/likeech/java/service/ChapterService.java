package dev.likeech.java.service;

import dev.likeech.java.model.dto.ChapterDTO;
import dev.likeech.java.model.request.ChapterReorderRequest;
import org.springframework.data.domain.Page;


import java.util.List;

public interface ChapterService {
    List<ChapterDTO> createChapters(List<String> titles, Long courseId);
    Page<ChapterDTO> getChapters(Long courseId, int page, int size);
    List<ChapterDTO> reorderChapters(Long courseId, List<ChapterReorderRequest> request);
    void updateChapterTitle(Long chapterId, String newTitle);
    void updateChapterStatus(Long chapterId, String status);
    void deleteChapter(Long chapterId);
    Page<ChapterDTO> getActiveChapters(Long courseId, int page, int size);
}
