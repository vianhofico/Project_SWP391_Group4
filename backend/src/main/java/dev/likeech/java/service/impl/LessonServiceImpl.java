package dev.likeech.java.service.impl;

import dev.likeech.java.entity.ResourceType;
import dev.likeech.java.exp.AppException;
import dev.likeech.java.exp.ErrorCode;
import dev.likeech.java.mapper.LessonDTOConverter;
import dev.likeech.java.model.dto.LessonDTO;
import dev.likeech.java.model.request.LessonReorderRequest;
import dev.likeech.java.model.request.LessonRequest;
import dev.likeech.java.repository.ChapterRepository;
import dev.likeech.java.repository.LessonRepository;
import dev.likeech.java.entity.ChapterEntity;
import dev.likeech.java.entity.LessonEntity;
import dev.likeech.java.entity.LessonMainVideoEntity;
import dev.likeech.java.service.LessonMainVideoService;
import dev.likeech.java.service.LessonService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonServiceImpl implements LessonService {
    private final LessonRepository lessonRepository;
    private final LessonDTOConverter lessonDTOConverter;
    private final ChapterRepository chapterRepository;
    private final LessonMainVideoService lessonMainVideoService;

    @Override
    public LessonDTO createLesson(LessonRequest request, Long chapterId) {
        ChapterEntity chapterEntity = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new AppException(ErrorCode.CHAPTER_NOT_FOUND));

        Integer maxOrder = lessonRepository.findMaxOrderByCourseId(chapterEntity.getChapterId());
        int nextOrder = (maxOrder == null ? 1 : maxOrder + 1);
        validateUniqueMedia(request.mainVideoUrl(),null,false);
        LessonMainVideoEntity entity =lessonMainVideoService.createMainVideo(request.mainVideoUrl());
        LessonEntity lessonEntity = new LessonEntity();
        lessonEntity.setCreatedAt(LocalDateTime.now());
        lessonEntity.setUpdateAt(LocalDateTime.now());
        lessonEntity.setChapter(chapterEntity);
        lessonEntity.setTitle(request.title());
        lessonEntity.setContent(request.content());
        lessonEntity.setMainVideoUrl(request.mainVideoUrl());
        lessonEntity.setLessonOrder(nextOrder);
        lessonEntity.setStatus(false);
        entity.setLesson(lessonEntity);
        List<LessonMainVideoEntity> lessonMainVideoEntities = new ArrayList<>();
        lessonMainVideoEntities.add(entity);
        lessonEntity.setMainVideos(lessonMainVideoEntities);
        LessonEntity savedEntity = lessonRepository.save(lessonEntity);
        return lessonDTOConverter.toLessonDTO(savedEntity);
    }
    private void validateUniqueMedia( String mainVideoUrl, Long currentLessonId, boolean isUpdate) {
        if (mainVideoUrl != null) {
            boolean isVideoUsed = isUpdate
                    ? lessonRepository.existsByMainVideoUrlAndLessonIdNot(mainVideoUrl, currentLessonId)
                    : lessonRepository.existsByMainVideoUrl(mainVideoUrl);
            if (isVideoUsed) {
                throw new AppException(ErrorCode.MAIN_VIDEO_ALREADY_USED);
            }
        }
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
    @Transactional
    public LessonDTO updateLesson(Long lessonId, LessonRequest request) {
        LessonEntity lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));

        validateUniqueMedia(request.mainVideoUrl(), lessonId, true);

        LocalDateTime now = LocalDateTime.now();

        lesson.setTitle(request.title());
        lesson.setContent(request.content());
        if(!request.status().isBlank()){
            lesson.setStatus(request.status().equalsIgnoreCase("Active") ? true : false);
        }
        lesson.setUpdateAt(now);
        if (!Objects.equals(lesson.getMainVideoUrl(), request.mainVideoUrl())) {
            lesson.getMainVideos().stream()
                    .filter(v -> !Boolean.TRUE.equals(v.getIsDelete()))
                    .forEach(v -> {
                        v.setIsDelete(true);
                        v.setDeletedAt(now);
                    });
            lesson.setMainVideoUrl(request.mainVideoUrl());

            LessonMainVideoEntity newVideo = lessonMainVideoService.createMainVideo(request.mainVideoUrl());
            newVideo.setLesson(lesson);
            lesson.getMainVideos().add(newVideo);
        }

        LessonEntity updated = lessonRepository.save(lesson);
        return lessonDTOConverter.toLessonDTO(updated);
    }



    @Override
    public LessonDTO getLesson(Long lessonId) {
        LessonEntity lessonEntity = lessonRepository.findById(lessonId).orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));
        return lessonDTOConverter.toLessonDTO(lessonEntity);
    }
}
