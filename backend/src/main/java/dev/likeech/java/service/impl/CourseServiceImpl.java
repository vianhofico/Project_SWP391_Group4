package dev.likeech.java.service.impl;

import dev.likeech.java.exp.AppException;
import dev.likeech.java.exp.ErrorCode;
import dev.likeech.java.mapper.CourseDTOConverter;
import dev.likeech.java.model.request.CourseCreateRequest;
import dev.likeech.java.model.request.CourseUpdateRequest;
import dev.likeech.java.model.dto.CourseDTO;
import dev.likeech.java.repository.AttachmentRepository;
import dev.likeech.java.repository.CourseRepository;
import dev.likeech.java.repository.TopicRepository;
import dev.likeech.java.repository.entity.AttachmentEntity;
import dev.likeech.java.repository.entity.CourseEntity;
import dev.likeech.java.repository.entity.ResourceType;
import dev.likeech.java.repository.entity.TopicEntity;
import dev.likeech.java.service.AttachmentService;
import dev.likeech.java.service.CourseService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

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
        validateUniqueMedia(request.imageUrl(),request.videoTrialUrl(),null,false);
        AttachmentEntity imageAttachment = attachmentService.createImageAttachment(request.imageUrl());
        AttachmentEntity videoAttachment = attachmentService.createVideoAttachment(request.videoTrialUrl());
        CourseEntity courseEntity = new CourseEntity();
        courseEntity.setTitle(request.title());
        courseEntity.setDescription(request.description());
        courseEntity.setImageUrl(request.imageUrl());
        courseEntity.setVideoTrialUrl(request.videoTrialUrl());
        courseEntity.setPrice(request.price());
        courseEntity.setCreatedAt(LocalDateTime.now());
        courseEntity.setUpdateAt(LocalDateTime.now());
        courseEntity.setStatus(false);
        List<AttachmentEntity> attachmentEntities = new ArrayList<>();
        attachmentEntities.add(imageAttachment);
        attachmentEntities.add(videoAttachment);
        return courseRepository.save(courseEntity);
    }
    @Override
    public List<CourseDTO> getCoursesNotInTopic(TopicEntity topicEntity) {
        List<CourseEntity> entities = courseRepository.findByTopicsNotContainingAndStatus(topicEntity, true);
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
        if (!Objects.equals(courseEntity.getImageUrl(), request.imageUrl())) {
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
        if (!Objects.equals(courseEntity.getVideoTrialUrl(), request.videoTrialUrl())) {
            courseEntity.getAttachments().stream()
                    .filter(a -> a.getType() == ResourceType.video && !a.getIsDeleted())
                    .forEach(a -> {
                        a.setIsDeleted(true);
                        a.setDeletedAt(now);
                    });

            // Tạo video mới
            AttachmentEntity newVideoAttachment = attachmentService.createVideoAttachment(request.videoTrialUrl());
            newAttachments.add(newVideoAttachment);
            courseEntity.setVideoTrialUrl(request.videoTrialUrl());
        }
        courseEntity.setTitle(request.title());
        courseEntity.setDescription(request.description());
        courseEntity.setPrice(request.price());

        courseEntity.setStatus(false);
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

    @Override
    public List<CourseDTO> searchCourses( List<CourseDTO> courses,String keyword) {
        if(keyword == null || keyword.isEmpty()){
            return courses;
        }else
        {
            String lowered = keyword.toLowerCase();
            return courses.stream()
                    .filter(course ->
                            (course.getTitle() != null && course.getTitle().toLowerCase().contains(lowered)) ||
                                    (course.getDescription() != null && course.getDescription().toLowerCase().contains(lowered))
                    )
                    .toList();
        }
    }

    @Override
    public List<CourseDTO> sortCourses(List<CourseDTO> courses, String sortBy, String order) {
        if (sortBy == null || sortBy.isEmpty() || order == null || order.isEmpty()) {
            return courses;
        }

        Comparator<CourseDTO> comparator;
        switch (sortBy) {
            case "price":
                comparator = Comparator.comparing(CourseDTO::getPrice, Comparator.nullsLast(Long::compareTo));
                break;
            case "updateAt":
                comparator = Comparator.comparing(CourseDTO::getUpdateAt, Comparator.nullsLast(LocalDateTime::compareTo));
                break;
            case "rating":
                comparator = Comparator.comparing(CourseDTO::getRating, Comparator.nullsLast(Double::compareTo));
                break;
            case "title":
            default:
                comparator = Comparator.comparing(CourseDTO::getTitle, Comparator.nullsLast(String::compareToIgnoreCase));
                break;
        }
        if ("desc".equalsIgnoreCase(order)) {
            comparator = comparator.reversed();
        }

        return courses.stream()
                .sorted(comparator)
                .toList();
    }

    @Override
    public List<CourseDTO> filterAndSortCourses(List<CourseDTO> courses, String keyword, String sortBy ,String order) {
        List<CourseDTO> searchedCourses = searchCourses(courses, keyword);
        return sortCourses(searchedCourses, sortBy, order);
    }

}
