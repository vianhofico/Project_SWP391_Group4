package dev.likeech.java.service.impl;

import dev.likeech.java.exp.AppException;
import dev.likeech.java.exp.ErrorCode;
import dev.likeech.java.mapper.CourseDTOConverter;
import dev.likeech.java.model.request.CourseCreateRequest;
import dev.likeech.java.model.request.CourseUpdateRequest;
import dev.likeech.java.model.dto.CourseDTO;
import dev.likeech.java.model.request.SearchCourseRequest;
import dev.likeech.java.model.request.SearchRequest;
import dev.likeech.java.repository.AttachmentRepository;
import dev.likeech.java.repository.CourseRepository;
import dev.likeech.java.repository.TopicRepository;
import dev.likeech.java.entity.AttachmentEntity;
import dev.likeech.java.entity.CourseEntity;
import dev.likeech.java.entity.ResourceType;
import dev.likeech.java.entity.TopicEntity;
import dev.likeech.java.service.AttachmentService;
import dev.likeech.java.service.CourseService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {
    private final CourseDTOConverter courseDTOConverter;
    private final CourseRepository courseRepository;
    private final TopicRepository topicRepository;
    private final AttachmentRepository attachmentRepository;
    private final AttachmentService attachmentService;
    @Override
    public List<CourseDTO> getAllCourseDtos() {
        List<CourseDTO> courseDtos = new ArrayList<>();
        List<CourseEntity> courseEntity = courseRepository.findAll();
        for (CourseEntity entity : courseEntity) {
            CourseDTO courseDTO = courseDTOConverter.toCourseDTO(entity);
            courseDtos.add(courseDTO);
        }
        return courseDtos;
    }

    @Override
    public CourseDTO getCourse(Long id) {
        CourseEntity courseEntity = courseRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        return courseDTOConverter.toCourseDTO(courseEntity);
    }
    private void validateUniqueMedia(String imageUrl, String videoTrialUrl, Long currentCourseId, boolean isUpdate) {
        if (imageUrl != null) {
            boolean isImageUsed = isUpdate
                    ? courseRepository.existsByImageUrlAndCourseIdNot(imageUrl, currentCourseId)
                    : courseRepository.existsByImageUrl(imageUrl);
            if (isImageUsed) {
                throw new IllegalArgumentException("The selected image has already been used by another course.");
            }
        }

        if (videoTrialUrl != null) {
            boolean isVideoUsed = isUpdate
                    ? courseRepository.existsByVideoTrialUrlAndCourseIdNot(videoTrialUrl, currentCourseId)
                    : courseRepository.existsByVideoTrialUrl(videoTrialUrl);
            if (isVideoUsed) {
                throw new IllegalArgumentException("The selected trial video has already been used by another course.");
            }
        }
    }

    @Override
    @Transactional
    public CourseEntity createCourse(CourseCreateRequest request) {
        TopicEntity topicEntity=topicRepository.findById(request.topicId()).orElseThrow(()-> new AppException(ErrorCode.TOPIC_NOT_FOUND)) ;
        validateUniqueMedia(request.imageUrl(),request.videoTrialUrl(),null,false);
        AttachmentEntity imageAttachment = attachmentService.createImageAttachment(request.imageUrl());
        AttachmentEntity videoAttachment = attachmentService.createVideoAttachment(request.videoTrialUrl());
        CourseEntity courseEntity = new CourseEntity();
        List<TopicEntity> topicEntities = new ArrayList<>();
        topicEntities.add(topicEntity);
        courseEntity.setTopics(topicEntities);
        courseEntity.setTitle(request.title());
        courseEntity.setDescription(request.description());
        courseEntity.setImageUrl(request.imageUrl());
        courseEntity.setVideoTrialUrl(request.videoTrialUrl());
        courseEntity.setPrice(request.price());
        courseEntity.setCreatedAt(LocalDateTime.now());
        courseEntity.setUpdateAt(LocalDateTime.now());
        courseEntity.setStatus(false);
        imageAttachment.setCourse(courseEntity);
        videoAttachment.setCourse(courseEntity);
        List<AttachmentEntity> attachmentEntities = new ArrayList<>();
        attachmentEntities.add(imageAttachment);
        attachmentEntities.add(videoAttachment);
        courseEntity.setAttachments(attachmentEntities);
        return courseRepository.save(courseEntity);
    }
    @Override
    public List<CourseDTO> getCoursesNotInTopic(TopicEntity topicEntity) {
        List<CourseEntity> entities = courseRepository.findByTopicsNotContaining(topicEntity);
        List<CourseDTO> courseDtos = new ArrayList<>();
        for (CourseEntity entity : entities) {
            CourseDTO courseDTO = courseDTOConverter.toCourseDTO(entity);
            courseDtos.add(courseDTO);
        }
        return courseDtos;
    }

    @Override
    @Transactional
    public CourseEntity updateCourse(CourseUpdateRequest request, Long id) {
        CourseEntity courseEntity = courseRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        validateUniqueMedia(request.imageUrl(), request.videoTrialUrl(), id, true);
        List<AttachmentEntity> newAttachments = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        if (request.imageUrl() != null && !Objects.equals(courseEntity.getImageUrl(), request.imageUrl())) {
            courseEntity.getAttachments().stream()
                    .filter(a -> a.getType() == ResourceType.image && !a.getIsDeleted())
                    .forEach(a -> {
                        a.setIsDeleted(true);
                        a.setDeletedAt(now);
                    });
            AttachmentEntity newImageAttachment = attachmentService.createImageAttachment(request.imageUrl());
            newAttachments.add(newImageAttachment);
            courseEntity.setImageUrl(request.imageUrl());
        }

        if (request.videoTrialUrl() != null && !Objects.equals(courseEntity.getVideoTrialUrl(), request.videoTrialUrl())) {
            courseEntity.getAttachments().stream()
                    .filter(a -> a.getType() == ResourceType.video && !a.getIsDeleted())
                    .forEach(a -> {
                        a.setIsDeleted(true);
                        a.setDeletedAt(now);
                    });
            AttachmentEntity newVideoAttachment = attachmentService.createVideoAttachment(request.videoTrialUrl());
            newAttachments.add(newVideoAttachment);
            courseEntity.setVideoTrialUrl(request.videoTrialUrl());
        }
        if (request.status() != null) {
            courseEntity.setStatus(request.status().equalsIgnoreCase("ACTIVE") ? true : false);
        }
        if (request.title() != null) {
            courseEntity.setTitle(request.title());
        }

        if (request.description() != null) {
            courseEntity.setDescription(request.description());
        }

        if (request.price() != null) {
            courseEntity.setPrice(request.price());
        }

        courseEntity.setUpdateAt(now);

        if (!newAttachments.isEmpty()) {
            courseEntity.getAttachments().addAll(newAttachments);
        }

        return courseRepository.save(courseEntity);
    }

    @Override
    public List<CourseDTO> getCoursesInTopic(Long topicId) {
        TopicEntity topicEntity = topicRepository.findById(topicId).orElseThrow(
                () -> new AppException(ErrorCode.TOPIC_NOT_FOUND));
        List<CourseEntity> entities = courseRepository.findByTopics(topicEntity);
        List<CourseDTO> courseDtos = new ArrayList<>();
        for (CourseEntity entity : entities) {
            CourseDTO courseDTO = courseDTOConverter.toCourseDTO(entity);
            courseDtos.add(courseDTO);
        }
        return courseDtos;
    }


    public Page<CourseDTO> filterAndSortCourses( SearchCourseRequest request) {
        Pageable pageable = PageRequest.of(
                request.page(),
                request.size(),
                Sort.by(Sort.Direction.fromString(request.order()),
                        Optional.ofNullable(request.field()).orElse("id"))
        );

        Page<CourseEntity> courses = courseRepository.findByFilter(
                request.topicId() != 0 ? request.topicId() : null,
                request.search(),
                request.status(),
                pageable
        );

        return courses.map(courseDTOConverter::toCourseDTO);
    }

    @Override
    public Page<CourseDTO> filterAndSort(List<CourseDTO> courses, SearchRequest request) {
        Stream<CourseDTO> stream = courses.stream();
        if (request.status() != null && !request.status().isEmpty()) {
            stream = stream.filter(course ->
                    request.status().equalsIgnoreCase(course.getStatus())
            );
        }

        if (request.search() != null && !request.search().isEmpty()) {
            String keyword = request.search().toLowerCase();
            stream = stream.filter(course ->
                    course.getTitle().toLowerCase().contains(keyword) ||
                            course.getDescription().toLowerCase().contains(keyword)
            );
        }

        Comparator<CourseDTO> comparator;
        String sortField = Optional.ofNullable(request.field()).orElse("title");
        switch (sortField) {
            case "price":
                comparator = Comparator.comparing(CourseDTO::getPrice, Comparator.nullsLast(Long::compareTo));
                break;
            case "rating":
                comparator = Comparator.comparing(CourseDTO::getRating, Comparator.nullsLast(Double::compareTo));
                break;
            case "updateAt":
                comparator = Comparator.comparing(CourseDTO::getUpdateAt, Comparator.nullsLast(LocalDateTime::compareTo));
                break;
            default:
                comparator = Comparator.comparing(CourseDTO::getTitle, Comparator.nullsLast(String::compareToIgnoreCase));
                break;
        }

        if ("desc".equalsIgnoreCase(request.order())) {
            comparator = comparator.reversed();
        }

        List<CourseDTO> sortedList = stream.sorted(comparator).toList();
        int start = request.page() * request.size();
        int end = Math.min(start + request.size(), sortedList.size());
        List<CourseDTO> pagedList = (start >= sortedList.size()) ? Collections.emptyList() : sortedList.subList(start, end);
        return new PageImpl<>(pagedList, PageRequest.of(request.page(), request.size()), sortedList.size());
    }



}
