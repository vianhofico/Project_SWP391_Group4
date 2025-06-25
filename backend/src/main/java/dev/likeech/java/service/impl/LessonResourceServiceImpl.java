package dev.likeech.java.service.impl;

import dev.likeech.java.entity.LessonEntity;
import dev.likeech.java.entity.LessonResourceEntity;
import dev.likeech.java.exp.AppException;
import dev.likeech.java.exp.ErrorCode;
import dev.likeech.java.mapper.ResourceDTOConverter;
import dev.likeech.java.model.dto.LessonResourceDTO;
import dev.likeech.java.model.request.ResourceCreateRequest;
import dev.likeech.java.model.request.ResourceFilterRequest;
import dev.likeech.java.repository.LessonRepository;
import dev.likeech.java.repository.LessonResourceRepository;
import dev.likeech.java.service.LessonResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class LessonResourceServiceImpl implements LessonResourceService {
    private final LessonResourceRepository lessonResourceRepository;
    private final ResourceDTOConverter resourceDTOConverter;
    private final LessonRepository lessonRepository;
    @Override
    public LessonResourceDTO createResource(ResourceCreateRequest request) {
        LessonResourceEntity entity = LessonResourceEntity.builder()
                .title(request.title())
                .url(request.url())
                .type(request.type())
                .isDeleted(true)
                .createdAt(LocalDateTime.now())
                .deletedAt(LocalDateTime.now())
                .lessons(new ArrayList<>())
                .build();

        LessonResourceEntity saved = lessonResourceRepository.save(entity);
        return resourceDTOConverter.toDto(saved);
    }
    @Override
    public Page<LessonResourceDTO> getResourcesInLesson(Long lessonId, ResourceFilterRequest filter) {
        Pageable pageable = PageRequest.of(
                filter.pageSafe(),
                filter.sizeSafe(),
                Sort.by(Sort.Direction.fromString(filter.directionSafe()), filter.sortBySafe())
        );

        Page<LessonResourceEntity> page = lessonResourceRepository.findByLessonId(lessonId, pageable);

        // Filter in-memory nếu cần, hoặc query trong repo nếu performance quan trọng
        Page<LessonResourceEntity> filteredPage = page.map(entity -> entity); // giữ nguyên nếu không cần filter

        // Hoặc áp dụng filter thủ công nếu không lọc trong query:
        Stream<LessonResourceEntity> stream = filteredPage.getContent().stream();

        if (filter.title() != null && !filter.title().isBlank()) {
            String titleFilter = filter.title().toLowerCase();
            stream = stream.filter(r -> r.getTitle() != null && r.getTitle().toLowerCase().contains(titleFilter));
        }

        if (filter.type() != null) {
            stream = stream.filter(r -> r.getType() == filter.type());
        }

        List<LessonResourceDTO> filteredContent = stream
                .map(resourceDTOConverter::toDto)
                .toList();

        return new PageImpl<>(filteredContent, pageable, filteredPage.getTotalElements());
    }
    @Override
    public Page<LessonResourceDTO> getResourcesNotInLesson(Long lessonId, ResourceFilterRequest filter) {
        LessonEntity lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));

        Pageable pageable = PageRequest.of(
                filter.pageSafe(),
                filter.sizeSafe(),
                Sort.by(Sort.Direction.fromString(filter.directionSafe()), filter.sortBySafe())
        );

        Page<LessonResourceEntity> page = lessonResourceRepository.findNotInLesson(lesson, pageable);
        Stream<LessonResourceEntity> stream = page.getContent().stream();
        if (filter.title() != null && !filter.title().isBlank()) {
            String titleFilter = filter.title().toLowerCase();
            stream = stream.filter(r -> r.getTitle() != null && r.getTitle().toLowerCase().contains(titleFilter));
        }
        if (filter.type() != null) {
            stream = stream.filter(r -> r.getType() == filter.type());
        }

        List<LessonResourceDTO> filteredContent = stream
                .map(resourceDTOConverter::toDto)
                .toList();

        return new PageImpl<>(filteredContent, pageable, page.getTotalElements());
    }

    @Override
    public void assignResourcesToLesson(Long lessonId, List<Long> resourceIds) {
        LessonEntity lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));
        List<LessonResourceEntity> resources = lessonResourceRepository.findAllById(resourceIds);
        for (LessonResourceEntity res : resources) {
            if (!lesson.getResources().contains(res)) {
                lesson.getResources().add(res);
                res.setIsDeleted(false);
                res.setDeletedAt(null);
                List<LessonEntity> list = res.getLessons();
                list.add(lesson);
                lessonResourceRepository.save(res);
            }
        }

        lessonRepository.save(lesson);
    }

    @Override
    public void removeResourcesFromLesson(Long lessonId, List<Long> resourceIds) {
        LessonEntity lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));

        List<LessonResourceEntity> resources = lessonResourceRepository.findAllById(resourceIds);
        for (LessonResourceEntity res : resources) {
            lesson.getResources().remove(res);
            res.getLessons().remove(lesson);
            if(res.getLessons().isEmpty()) {
                res.setIsDeleted(true);
            }
            lessonResourceRepository.save(res);
        }

        lessonRepository.save(lesson);
    }


    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void permanentlyDeleteOldResources() {
        LocalDateTime oneMonthAgo = LocalDateTime.now().minusMonths(1);
        List<LessonResourceEntity> oldResources = lessonResourceRepository
                .findByIsDeletedTrueAndDeletedAtBefore(oneMonthAgo);

        if (!oldResources.isEmpty()) {
            lessonResourceRepository.deleteAll(oldResources);
            System.out.println("✅ Deleted " + oldResources.size() + " old resources.");
        }
    }
}
