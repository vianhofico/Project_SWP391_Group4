package dev.likeech.java.service.impl;

import dev.likeech.java.exp.AppException;
import dev.likeech.java.exp.ErrorCode;
import dev.likeech.java.mapper.ChapterDTOConverter;
import dev.likeech.java.model.dto.ChapterDTO;
import dev.likeech.java.model.request.ChapterReorderRequest;
import dev.likeech.java.repository.ChapterRepository;
import dev.likeech.java.repository.CourseRepository;
import dev.likeech.java.repository.entity.ChapterEntity;
import dev.likeech.java.repository.entity.CourseEntity;
import dev.likeech.java.service.ChapterService;
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
public class ChapterServiceImpl implements ChapterService {
    private final ChapterRepository chapterRepository;
    private final CourseRepository courseRepository;
    private final ChapterDTOConverter chapterDTOConverter;
    @Override
    public List<ChapterDTO> createChapters(List<String> titles, Long courseId){
        List<ChapterEntity> entities = new ArrayList<>();
        CourseEntity courseEntity = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        Integer maxOrder = chapterRepository.findMaxOrderByCourseId(courseEntity.getCourseId());
        int nextOrder = (maxOrder == null ? 1 : maxOrder + 1);
        for(String title : titles) {
            ChapterEntity chapterEntity = new ChapterEntity();
            chapterEntity.setCreatedAt(LocalDateTime.now());
            chapterEntity.setUpdateAt(LocalDateTime.now());
            chapterEntity.setCourse(courseEntity);
            chapterEntity.setTitle(title);
            chapterEntity.setChapterOrder(nextOrder);
            chapterEntity.setStatus(false);
            entities.add(chapterEntity);
            nextOrder++;
        }
        chapterRepository.saveAll(entities);
        List<ChapterDTO> dtos = new ArrayList<>();
        for(ChapterEntity entity : entities) {
            ChapterDTO dto = chapterDTOConverter.toChapterDTO(entity);
            dtos.add(dto);
        }
        return dtos;
    }

    @Override
    public List<ChapterDTO> getChapters(Long courseId) {
        List<ChapterEntity> chapterEntities = chapterRepository.findByCourse_courseId(courseId);
        List<ChapterDTO> dtos = new ArrayList<>();
        for(ChapterEntity chapterEntity : chapterEntities) {
            ChapterDTO chapterDTO = chapterDTOConverter.toChapterDTO(chapterEntity);
            dtos.add(chapterDTO);
        }
        return dtos;
    }
    @Override
    public List<ChapterDTO> reorderChapters(Long courseId, List<ChapterReorderRequest> request) {
        CourseEntity course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        List<Long> chapterIds = request.stream()
                .map(ChapterReorderRequest::chapterId)
                .toList();

        List<ChapterEntity> chapters = chapterRepository.findAllById(chapterIds);

        Map<Long, Integer> orderMap = request.stream()
                .collect(Collectors.toMap(ChapterReorderRequest::chapterId, ChapterReorderRequest::chapterOrder));

        for (ChapterEntity chapter : chapters) {
            if (!chapter.getCourse().getCourseId().equals(courseId)) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }
            Integer newOrder = orderMap.get(chapter.getChapterId());
            if (newOrder != null) {
                chapter.setChapterOrder(newOrder);
            }
        }
        chapterRepository.saveAll(chapters);
        List<ChapterDTO> dtos = chapters.stream()
                .sorted(Comparator.comparing(ChapterEntity::getChapterOrder))
                .map(chapterDTOConverter::toChapterDTO)
                .toList();
        return dtos;
    }
    @Override
    public void updateChapterTitle(Long chapterId, String newTitle) {
        ChapterEntity chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));

        chapter.setTitle(newTitle);
        chapterRepository.save(chapter);
    }


}
