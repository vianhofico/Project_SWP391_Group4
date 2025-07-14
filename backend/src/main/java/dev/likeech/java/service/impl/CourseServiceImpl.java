package dev.likeech.java.service.impl;

import dev.likeech.java.entity.*;
import dev.likeech.java.exp.AppException;
import dev.likeech.java.exp.ErrorCode;
import dev.likeech.java.mapper.CourseDTOConverter;
import dev.likeech.java.model.request.CourseCreateRequest;
import dev.likeech.java.model.request.CourseUpdateRequest;
import dev.likeech.java.model.dto.CourseDTO;
import dev.likeech.java.model.request.SearchCourseRequest;
import dev.likeech.java.model.request.SearchRequest;
import dev.likeech.java.repository.*;
import dev.likeech.java.service.AttachmentService;
import dev.likeech.java.service.CourseService;
import dev.likeech.java.service.LessonProgressService;
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
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    public List<CourseDTO> getAllCourseDtos() {
        List<CourseDTO> courseDtos = new ArrayList<>();
        List<Course> course = courseRepository.findAll();
        for (Course entity : course) {
            CourseDTO courseDTO = courseDTOConverter.toCourseDTO(entity);
            courseDTO.setRating(getAverageRating(entity));
            courseDtos.add(courseDTO);
        }
        return courseDtos;
    }

    @Override
    public CourseDTO getCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        CourseDTO courseDTO = courseDTOConverter.toCourseDTO(course);
        courseDTO.setRating(getAverageRating(course));
        return courseDTO;
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
    public Course createCourse(CourseCreateRequest request) {
        Topic topic = topicRepository.findById(request.topicId()).orElseThrow(() -> new AppException(ErrorCode.TOPIC_NOT_FOUND));
        validateUniqueMedia(request.imageUrl(), request.videoTrialUrl(), null, false);
        Attachment imageAttachment = attachmentService.createImageAttachment(request.imageUrl());
        Attachment videoAttachment = attachmentService.createVideoAttachment(request.videoTrialUrl());
        Course course = new Course();
        List<Topic> topicEntities = new ArrayList<>();
        topicEntities.add(topic);
        course.setTopics(topicEntities);
        course.setTitle(request.title());
        course.setDescription(request.description());
        course.setImageUrl(request.imageUrl());
        course.setVideoTrialUrl(request.videoTrialUrl());
        course.setPrice(request.price());
        course.setCreatedAt(LocalDateTime.now());
        course.setUpdateAt(LocalDateTime.now());
        course.setStatus(false);
        imageAttachment.setCourse(course);
        videoAttachment.setCourse(course);
        List<Attachment> attachmentEntities = new ArrayList<>();
        attachmentEntities.add(imageAttachment);
        attachmentEntities.add(videoAttachment);
        course.setAttachments(attachmentEntities);
        return courseRepository.save(course);
    }

    @Override
    public List<CourseDTO> getCoursesNotInTopic(Topic topic) {
        List<Course> entities = courseRepository.findByTopicsNotContaining(topic);
        List<CourseDTO> courseDtos = new ArrayList<>();
        for (Course entity : entities) {
            CourseDTO courseDTO = courseDTOConverter.toCourseDTO(entity);
            courseDTO.setRating(getAverageRating(entity));
            courseDtos.add(courseDTO);
        }
        return courseDtos;
    }

    @Override
    @Transactional
    public Course updateCourse(CourseUpdateRequest request, Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        validateUniqueMedia(request.imageUrl(), request.videoTrialUrl(), id, true);
        List<Attachment> newAttachments = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        if (request.imageUrl() != null && !Objects.equals(course.getImageUrl(), request.imageUrl())) {
            course.getAttachments().stream()
                    .filter(a -> a.getType() == ResourceType.image && !a.getIsDeleted())
                    .forEach(a -> {
                        a.setIsDeleted(true);
                        a.setDeletedAt(now);
                    });
            Attachment newImageAttachment = attachmentService.createImageAttachment(request.imageUrl());
            newAttachments.add(newImageAttachment);
            course.setImageUrl(request.imageUrl());
        }

        if (request.videoTrialUrl() != null && !Objects.equals(course.getVideoTrialUrl(), request.videoTrialUrl())) {
            course.getAttachments().stream()
                    .filter(a -> a.getType() == ResourceType.video && !a.getIsDeleted())
                    .forEach(a -> {
                        a.setIsDeleted(true);
                        a.setDeletedAt(now);
                    });
            Attachment newVideoAttachment = attachmentService.createVideoAttachment(request.videoTrialUrl());
            newAttachments.add(newVideoAttachment);
            course.setVideoTrialUrl(request.videoTrialUrl());
        }
        if (request.status() != null) {
            course.setStatus(request.status().equalsIgnoreCase("ACTIVE") ? true : false);
        }
        if (request.title() != null) {
            course.setTitle(request.title());
        }

        if (request.description() != null) {
            course.setDescription(request.description());
        }

        if (request.price() != null) {
            course.setPrice(request.price());
        }

        course.setUpdateAt(now);

        if (!newAttachments.isEmpty()) {
            course.getAttachments().addAll(newAttachments);
        }

        return courseRepository.save(course);
    }

    @Override
    public List<CourseDTO> getCoursesInTopic(Long topicId) {
        Topic topic = topicRepository.findById(topicId).orElseThrow(
                () -> new AppException(ErrorCode.TOPIC_NOT_FOUND));
        List<Course> entities = courseRepository.findByTopics(topic);
        List<CourseDTO> courseDtos = new ArrayList<>();
        for (Course entity : entities) {
            double rating = getAverageRating(entity);
            CourseDTO courseDTO = courseDTOConverter.toCourseDTO(entity);
            courseDTO.setRating(rating);
            courseDtos.add(courseDTO);
        }
        return courseDtos;
    }

    public double getAverageRating(Course course) {
        if (course.getRatings() != null && !course.getRatings().isEmpty()) {
            return course.getRatings().stream()
                    .mapToDouble(Rating::getScore)
                    .average()
                    .orElse(0.0);
        }
        return 0.0;
    }

    @Override
    @Transactional
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        if (course.getEnrollments() != null && course.getEnrollments().size() > 0) {
            throw new AppException(ErrorCode.COURSE_HAS_ENROLLMENTS);
        } else {
            courseRepository.delete(course);
        }
    }

    @Override
    public CourseDTO getCourseWithProgress(Long courseId, Long userId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        // Lấy danh sách bài học
        List<Lesson> lessons = lessonRepository.findByChapter_Course_CourseIdAndStatusTrue(courseId);
        List<Long> lessonIds = lessons.stream().map(Lesson::getLessonId).toList();

        if (lessonIds.isEmpty()) {
            return courseDTOConverter.toCourseDTO(course, 0f); // Không có bài học => progress = 0
        }

        // Lấy các bài học đã hoàn thành
        List<LessonProgress> completed = lessonProgressRepository.findCompletedByUserAndLessonIds(userId, lessonIds);

        int total = lessonIds.size();
        int done = completed.size();
        float progress = ((float) done / total) * 100f;

        // Cập nhật progress vào Enrollment nếu tồn tại
        enrollmentRepository.findByUser_UserIdAndCourse_CourseId(userId, courseId)
                .ifPresent(enrollment -> {
                    enrollment.setProgress(progress);
                    enrollmentRepository.save(enrollment); // lưu lại
                });

        CourseDTO courseDTO = courseDTOConverter.toCourseDTO(course, progress);
        courseDTO.setRating(getAverageRating(course));
        return courseDTO;
    }


    public Page<CourseDTO> filterAndSortCourses(SearchCourseRequest request) {
        Pageable pageable = PageRequest.of(
                request.page(),
                request.size(),
                Sort.by(Sort.Direction.fromString(request.order()),
                        Optional.ofNullable(request.field()).orElse("id"))
        );

        Page<Course> courses = courseRepository.findByFilter(
                request.topicId() != 0 ? request.topicId() : null,
                request.search(),
                request.status(),
                pageable
        );

        return courses.map(course -> {
            CourseDTO dto = courseDTOConverter.toCourseDTO(course);
            dto.setRating(getAverageRating(course));
            return dto;
        });
    }

    @Override
    public Page<CourseDTO> filterAndSort(List<CourseDTO> courses, SearchRequest request) {
        for (CourseDTO dto : courses) {
            if (dto.getRating() == null && dto.getCourseId() != null) {
                Course course = courseRepository.findById(dto.getCourseId())
                        .orElse(null);
                if (course != null) {
                    dto.setRating(getAverageRating(course));
                } else {
                    dto.setRating(0.0); // fallback nếu không tìm thấy
                }
            }
        }

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
            case "popular":
                comparator = Comparator.comparing(course ->
                        course.getAttachmentIds() != null ? course.getAttachmentIds().size() : 0
                );
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


