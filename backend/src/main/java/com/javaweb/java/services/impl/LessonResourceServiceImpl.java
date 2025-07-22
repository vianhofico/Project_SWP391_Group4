package com.javaweb.java.services.impl;

import com.javaweb.java.entities.Lesson;
import com.javaweb.java.entities.LessonResource;
import com.javaweb.java.exceptions.AppException;
import com.javaweb.java.exceptions.ErrorCode;
import com.javaweb.java.converter.ResourceDTOConverter;
import com.javaweb.java.dtos.response.LessonResourceDTO;
import com.javaweb.java.dtos.request.ResourceCreateRequest;
import com.javaweb.java.dtos.request.ResourceFilterRequest;
import com.javaweb.java.repositories.LessonRepository;
import com.javaweb.java.repositories.LessonResourceRepository;
import com.javaweb.java.services.LessonResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
        LessonResource entity = LessonResource.builder()
                .title(request.title())
                .url(request.url())
                .type(request.type())
                .isDeleted(true)
                .createdAt(LocalDateTime.now())
                .deletedAt(LocalDateTime.now())
                .lessons(new ArrayList<>())
                .build();

        LessonResource saved = lessonResourceRepository.save(entity);
        return resourceDTOConverter.toDto(saved);
    }
    @Override
    public Page<LessonResourceDTO> getResourcesInLesson(Long lessonId, ResourceFilterRequest filter) {
        Pageable pageable = PageRequest.of(
                filter.pageSafe(),
                filter.sizeSafe(),
                Sort.by(Sort.Direction.fromString(filter.directionSafe()), filter.sortBySafe())
        );

        Page<LessonResource> page = lessonResourceRepository.findByLessonId(lessonId, pageable);

        // Filter in-memory nếu cần, hoặc query trong repo nếu performance quan trọng
        Page<LessonResource> filteredPage = page.map(entity -> entity); // giữ nguyên nếu không cần filter

        // Hoặc áp dụng filter thủ công nếu không lọc trong query:
        Stream<LessonResource> stream = filteredPage.getContent().stream();

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
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));

        Pageable pageable = PageRequest.of(
                filter.pageSafe(),
                filter.sizeSafe(),
                Sort.by(Sort.Direction.fromString(filter.directionSafe()), filter.sortBySafe())
        );

        Page<LessonResource> page = lessonResourceRepository.findNotInLesson(lesson, pageable);
        Stream<LessonResource> stream = page.getContent().stream();
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
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));
        List<LessonResource> resources = lessonResourceRepository.findAllById(resourceIds);
        for (LessonResource res : resources) {
            if (!lesson.getResources().contains(res)) {
                lesson.getResources().add(res);
                res.setIsDeleted(false);
                res.setDeletedAt(null);
                List<Lesson> list = res.getLessons();
                list.add(lesson);
                lessonResourceRepository.save(res);
            }
        }

        lessonRepository.save(lesson);
    }

    @Override
    public void removeResourcesFromLesson(Long lessonId, List<Long> resourceIds) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));

        List<LessonResource> resources = lessonResourceRepository.findAllById(resourceIds);
        for (LessonResource res : resources) {
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
        List<LessonResource> oldResources = lessonResourceRepository
                .findByIsDeletedTrueAndDeletedAtBefore(oneMonthAgo);

        if (!oldResources.isEmpty()) {
            lessonResourceRepository.deleteAll(oldResources);
            System.out.println("✅ Deleted " + oldResources.size() + " old resources.");
        }
    }
}
