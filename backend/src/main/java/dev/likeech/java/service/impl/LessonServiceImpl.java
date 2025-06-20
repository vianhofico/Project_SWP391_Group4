package dev.likeech.java.service.impl;

import dev.likeech.java.exp.AppException;
import dev.likeech.java.exp.ErrorCode;
import dev.likeech.java.mapper.LessonDTOConverter;
import dev.likeech.java.model.dto.LessonDTO;
import dev.likeech.java.model.request.LessonReorderRequest;
import dev.likeech.java.model.request.LessonRequest;
import dev.likeech.java.model.request.ChapterReorderRequest;
import dev.likeech.java.repository.ChapterRepository;
import dev.likeech.java.repository.LessonRepository;
import dev.likeech.java.repository.entity.ChapterEntity;
import dev.likeech.java.repository.entity.LessonEntity;
import dev.likeech.java.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonServiceImpl implements LessonService {
    private final LessonRepository lessonRepository;
    private final LessonDTOConverter lessonDTOConverter;
    private final ChapterRepository chapterRepository;

    @Override
    public LessonDTO createLesson(LessonRequest request, Long chapterId) {
        ChapterEntity chapterEntity = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new AppException(ErrorCode.CHAPTER_NOT_FOUND));

        Integer maxOrder = lessonRepository.findMaxOrderByCourseId(chapterEntity.getChapterId());
        int nextOrder = (maxOrder == null ? 1 : maxOrder + 1);

        LessonEntity lessonEntity = new LessonEntity();
        lessonEntity.setCreatedAt(LocalDateTime.now());
        lessonEntity.setUpdateAt(LocalDateTime.now());
        lessonEntity.setChapter(chapterEntity);
        if(lessonRepository.findByMainVideoUrl(request.mainVideoUrl()) == null) {
            lessonEntity.setMainVideoUrl(request.mainVideoUrl());
        }
        else{
            throw new AppException(ErrorCode.MAIN_VIDEO_ALREADY_USED);
        }
        lessonEntity.setTitle(request.title());
        lessonEntity.setContent(request.content());
        lessonEntity.setLessonOrder(nextOrder);
        lessonEntity.setStatus(false);
        LessonEntity savedEntity = lessonRepository.save(lessonEntity);

        return lessonDTOConverter.toLessonDTO(savedEntity);
    }


    @Override
    public List<LessonDTO> getLessons(Long chapterId) {
        List<LessonEntity> lessonEntities = lessonRepository.findByChapter_chapterId(chapterId);
        List<LessonDTO> dtos = new ArrayList<>();
        for(LessonEntity lessonEntity : lessonEntities) {
            LessonDTO lessonDTO = lessonDTOConverter.toLessonDTO(lessonEntity);
            dtos.add(lessonDTO);
        }
        return dtos;
    }

    @Override
    public List<LessonDTO> reorderLessons(Long chapterId, List<LessonReorderRequest> request) {
        ChapterEntity chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new AppException(ErrorCode.CHAPTER_NOT_FOUND));

        List<Long> lessonIds = request.stream()
                .map(LessonReorderRequest::lessonId)
                .toList();

        List<LessonEntity> lessonEntities = lessonRepository.findAllById(lessonIds);

        Map<Long, Integer> orderMap = request.stream()
                .collect(Collectors.toMap(LessonReorderRequest::lessonId, LessonReorderRequest::lessonOrder));

        for (LessonEntity lesson : lessonEntities) {
            if (!lesson.getChapter().getChapterId().equals(chapterId)) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }
            Integer newOrder = orderMap.get(lesson.getLessonId());
            if (newOrder != null) {
                lesson.setLessonOrder(newOrder);
            }
        }
        lessonRepository.saveAll(lessonEntities);
        List<LessonDTO> dtos = lessonEntities.stream()
                .sorted(Comparator.comparing(LessonEntity::getLessonOrder))
                .map(lessonDTOConverter::toLessonDTO)
                .toList();
        return dtos;
    }

    @Override
    public LessonDTO updateLesson(Long lessonId, LessonRequest request) {
        LessonEntity lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));

        lesson.setTitle(request.title());
        lesson.setContent(request.content());
        if(lessonRepository.findByMainVideoUrl(request.mainVideoUrl()) == null) {
            lesson.setMainVideoUrl(request.mainVideoUrl());
        }
        else{
            throw new AppException(ErrorCode.MAIN_VIDEO_ALREADY_USED);
        }
        lessonRepository.save(lesson);
        return lessonDTOConverter.toLessonDTO(lesson);
    }
}
