package dev.likeech.java.service.impl;

import dev.likeech.java.entity.*;
import dev.likeech.java.exp.AppException;
import dev.likeech.java.exp.ErrorCode;
import dev.likeech.java.mapper.LessonDTOConverter;
import dev.likeech.java.model.dto.LessonDTO;
import dev.likeech.java.model.request.LessonReorderRequest;
import dev.likeech.java.model.request.LessonRequest;
import dev.likeech.java.repository.*;
import dev.likeech.java.service.LessonMainVideoService;
import dev.likeech.java.service.LessonService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final CourseRepository courseRepository;


    @Override
    public LessonDTO createLesson(LessonRequest request, Long chapterId) {
        Chapter chapterEntity = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new AppException(ErrorCode.CHAPTER_NOT_FOUND));

        Integer maxOrder = lessonRepository.findMaxOrderByCourseId(chapterEntity.getChapterId());
        int nextOrder = (maxOrder == null ? 1 : maxOrder + 1);
        validateUniqueMedia(request.mainVideoUrl(),null,false);
        LessonMainVideo entity =lessonMainVideoService.createMainVideo(request.mainVideoUrl());
        Lesson lesson = new Lesson();
        lesson.setCreatedAt(LocalDateTime.now());
        lesson.setUpdateAt(LocalDateTime.now());
        lesson.setChapter(chapterEntity);
        lesson.setTitle(request.title());
        lesson.setContent(request.content());
        lesson.setMainVideoUrl(request.mainVideoUrl());
        lesson.setLessonOrder(nextOrder);
        lesson.setStatus(false);
        entity.setLesson(lesson);
        List<LessonMainVideo> lessonMainVideoEntities = new ArrayList<>();
        lessonMainVideoEntities.add(entity);
        lesson.setMainVideos(lessonMainVideoEntities);
        Lesson savedEntity = lessonRepository.save(lesson);
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
        List<Lesson> lessonEntities = lessonRepository.findByChapter_chapterId(chapterId);
        List<LessonDTO> dtos = new ArrayList<>();
        for(Lesson lesson : lessonEntities) {
            LessonDTO lessonDTO = lessonDTOConverter.toLessonDTO(lesson);
            dtos.add(lessonDTO);
        }
        return dtos;
    }

    @Override
    public List<LessonDTO> reorderLessons(Long chapterId, List<LessonReorderRequest> request) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new AppException(ErrorCode.CHAPTER_NOT_FOUND));
        Course course = courseRepository.findByChapterId(chapterId).
                orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        if (enrollmentRepository.existsByCourse_CourseId(course.getCourseId())) {
            throw new AppException(ErrorCode.COURSE_HAS_ENROLLMENTS);
        }

        List<Long> lessonIds = request.stream()
                .map(LessonReorderRequest::lessonId)
                .toList();

        List<Lesson> lessonEntities = lessonRepository.findAllById(lessonIds);

        Map<Long, Integer> orderMap = request.stream()
                .collect(Collectors.toMap(LessonReorderRequest::lessonId, LessonReorderRequest::lessonOrder));

        for (Lesson lesson : lessonEntities) {
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
                .sorted(Comparator.comparing(Lesson::getLessonOrder))
                .map(lessonDTOConverter::toLessonDTO)
                .toList();
        return dtos;
    }

    @Override
    @Transactional
    public LessonDTO updateLesson(Long lessonId, LessonRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
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

            LessonMainVideo newVideo = lessonMainVideoService.createMainVideo(request.mainVideoUrl());
            newVideo.setLesson(lesson);
            lesson.getMainVideos().add(newVideo);
        }

        Lesson updated = lessonRepository.save(lesson);
        return lessonDTOConverter.toLessonDTO(updated);
    }



    @Override
    public LessonDTO getLesson(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId).orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));
        return lessonDTOConverter.toLessonDTO(lesson);
    }

    @Override
    public void deleteLesson(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId).orElseThrow(()->new AppException(ErrorCode.LESSON_NOT_FOUND));
        if(lesson.getChapter().getCourse().getEnrollments() != null ||
                !lesson.getChapter().getCourse().getEnrollments().isEmpty()){
            throw new AppException(ErrorCode.COURSE_HAS_ENROLLMENTS);
        }
        else {
            lessonRepository.delete(lesson);
        }
    }

    @Override
    public Page<LessonDTO> getActiveLessons(Long chapterId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("lessonOrder").ascending());
        Page<Lesson> lessonPages = lessonRepository.findByChapter_chapterIdAndStatusTrue(chapterId,pageable);
        return lessonPages.map(lessonDTOConverter::toLessonDTO);
    }

    @Override
    public LessonDTO getLessonDetailForUser(Long lessonId, String username) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found"));

        Course course = lesson.getChapter().getCourse();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (user.getRole().equals(Role.ADMIN)) {
            return lessonDTOConverter.toLessonDTO(lesson); // Admin không cần check tiến trình
        }

        boolean isEnrolled = enrollmentRepository.existsByUserAndCourse(user, course);
        if (!isEnrolled) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not enrolled in this course");
        }

        LessonProgress progress = lessonProgressRepository
                .findByUserAndLesson(user, lesson)
                .orElse(null);

        return lessonDTOConverter.toLessonDTO(lesson, progress);
    }

    @Override
    public List<LessonDTO> getActiveLessonsByChapterForUser(Long chapterId, Long userId) {
        Chapter currentChapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new AppException(ErrorCode.CHAPTER_NOT_FOUND));
        Long courseId = currentChapter.getCourse().getCourseId();

        // 1. Lấy danh sách chương trong khóa học
        List<Chapter> chapters = chapterRepository.findByCourse_CourseIdOrderByChapterOrderAsc(courseId);

        // 2. Lấy toàn bộ LessonProgress của user
        List<LessonProgress> allProgress = lessonProgressRepository.findByUser_UserIdAndIsCompletedTrue(userId);
        Set<Long> completedLessonIds = allProgress.stream()
                .map(lp -> lp.getLesson().getLessonId())
                .collect(Collectors.toSet());

        // Tạo map từ lessonId -> progress
        Map<Long, LessonProgress> progressMap = allProgress.stream()
                .collect(Collectors.toMap(lp -> lp.getLesson().getLessonId(), lp -> lp));

        // 3. Tạo map bài học theo chương
        Map<Long, List<Lesson>> chapterLessonMap = new HashMap<>();
        for (Chapter chapter : chapters) {
            List<Lesson> lessons = lessonRepository.findByChapter_ChapterIdAndStatusTrueOrderByLessonOrderAsc(chapter.getChapterId());
            chapterLessonMap.put(chapter.getChapterId(), lessons);
        }

        // 4. Tìm chương đầu tiên chưa hoàn thành
        Chapter firstIncompleteChapter = chapters.stream()
                .filter(ch -> {
                    List<Lesson> lessons = chapterLessonMap.getOrDefault(ch.getChapterId(), List.of());
                    return !lessons.isEmpty() && lessons.stream().anyMatch(l -> !completedLessonIds.contains(l.getLessonId()));
                })
                .findFirst()
                .orElse(null);

        List<Lesson> currentLessons = chapterLessonMap.getOrDefault(chapterId, List.of());
        List<LessonDTO> result = new ArrayList<>();

        // 5. Nếu currentChapter đến sau => khóa toàn bộ bài học
        if (firstIncompleteChapter != null &&
                currentChapter.getChapterOrder() > firstIncompleteChapter.getChapterOrder()) {

            for (Lesson lesson : currentLessons) {
                LessonDTO dto = lessonDTOConverter.toLessonDTO(lesson, progressMap.get(lesson.getLessonId()));
                dto.setIsLocked(true); // override lock
                result.add(dto);
            }

            return result;
        }

        // 6. Nếu currentChapter là chương hiện tại => mở tuần tự
        for (int i = 0; i < currentLessons.size(); i++) {
            Lesson lesson = currentLessons.get(i);
            boolean isLocked = true;

            if (i == 0) {
                isLocked = false;
            } else {
                Lesson previousLesson = currentLessons.get(i - 1);
                if (completedLessonIds.contains(previousLesson.getLessonId())) {
                    isLocked = false;
                }
            }

            LessonDTO dto = lessonDTOConverter.toLessonDTO(lesson, progressMap.get(lesson.getLessonId()));
            dto.setIsLocked(isLocked);
            result.add(dto);
        }

        return result;
    }

}
