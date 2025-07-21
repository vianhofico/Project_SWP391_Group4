package dev.likeech.java.service.impl;

import dev.likeech.java.exp.AppException;
import dev.likeech.java.exp.ErrorCode;
import dev.likeech.java.mapper.ChapterDTOConverter;
import dev.likeech.java.model.dto.ChapterDTO;
import dev.likeech.java.model.request.ChapterReorderRequest;
import dev.likeech.java.repository.ChapterRepository;
import dev.likeech.java.repository.CourseRepository;
import dev.likeech.java.entity.Chapter;
import dev.likeech.java.entity.Course;
import dev.likeech.java.repository.EnrollmentRepository;
import dev.likeech.java.service.ChapterService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    private final EnrollmentRepository enrollmentRepository;
    @Override
    public List<ChapterDTO> createChapters(List<String> titles, Long courseId){
        List<Chapter> entities = new ArrayList<>();
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        Integer maxOrder = chapterRepository.findMaxOrderByCourseId(course.getCourseId());
        int nextOrder = (maxOrder == null ? 1 : maxOrder + 1);
        for(String title : titles) {
            Chapter chapterEntity = new Chapter();
            chapterEntity.setCreatedAt(LocalDateTime.now());
            chapterEntity.setUpdateAt(LocalDateTime.now());
            chapterEntity.setCourse(course);
            chapterEntity.setTitle(title);
            chapterEntity.setChapterOrder(nextOrder);
            chapterEntity.setStatus(false);
            entities.add(chapterEntity);
            nextOrder++;
        }
        chapterRepository.saveAll(entities);
        List<ChapterDTO> dtos = new ArrayList<>();
        for(Chapter entity : entities) {
            ChapterDTO dto = chapterDTOConverter.toChapterDTO(entity);
            dtos.add(dto);
        }
        return dtos;
    }

    @Override
    public Page<ChapterDTO> getChapters(Long courseId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("chapterOrder").ascending());
        Page<Chapter> chapterPage = chapterRepository.findByCourse_courseId(courseId, pageable);
        return chapterPage.map(chapterDTOConverter::toChapterDTO);
    }
    @Override
    public Page<ChapterDTO> getActiveChapters(Long courseId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("chapterOrder").ascending());
        Page<Chapter> chapterPage = chapterRepository.findByCourse_courseIdAndStatusTrue(courseId, pageable);
        return chapterPage.map(chapterDTOConverter::toChapterDTO);
    }


    @Override
    public List<ChapterDTO> reorderChapters(Long courseId, List<ChapterReorderRequest> request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        if (enrollmentRepository.existsByCourse_CourseId(course.getCourseId())) {
            throw new AppException(ErrorCode.COURSE_HAS_ENROLLMENTS);
        }
        List<Long> chapterIds = request.stream()
                .map(ChapterReorderRequest::chapterId)
                .toList();

        List<Chapter> chapters = chapterRepository.findAllById(chapterIds);

        Map<Long, Integer> orderMap = request.stream()
                .collect(Collectors.toMap(ChapterReorderRequest::chapterId, ChapterReorderRequest::chapterOrder));

        for (Chapter chapter : chapters) {
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
                .sorted(Comparator.comparing(Chapter::getChapterOrder))
                .map(chapterDTOConverter::toChapterDTO)
                .toList();
        return dtos;
    }
    @Override
    public void updateChapterTitle(Long chapterId, String newTitle) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new AppException(ErrorCode.CHAPTER_NOT_FOUND));
        if(!newTitle.isBlank()){
            chapter.setTitle(newTitle);
        }
        chapterRepository.save(chapter);
    }

    @Override
    public void updateChapterStatus(Long chapterId, String status) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new AppException(ErrorCode.CHAPTER_NOT_FOUND));
        if(!status.isBlank()){
            chapter.setStatus(status.equalsIgnoreCase("ACTIVE") ? true : false);
        }
        chapterRepository.save(chapter);
    }

    @Override
    public void deleteChapter(Long chapterId) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new AppException(ErrorCode.CHAPTER_NOT_FOUND));
        if(chapter.getCourse().getEnrollments() != null && chapter.getCourse().getEnrollments().size() > 0){
            throw new AppException(ErrorCode.COURSE_HAS_ENROLLMENTS);
        }
        else {
            chapterRepository.delete(chapter);
        }
    }

}
