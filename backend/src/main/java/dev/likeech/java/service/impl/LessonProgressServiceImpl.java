package dev.likeech.java.service.impl;

import dev.likeech.java.entity.Lesson;
import dev.likeech.java.entity.LessonProgress;
import dev.likeech.java.entity.User;
import dev.likeech.java.exp.AppException;
import dev.likeech.java.exp.ErrorCode;
import dev.likeech.java.mapper.LessonProgressDTOConverter;
import dev.likeech.java.model.dto.LessonProgressDTO;
import dev.likeech.java.repository.LessonProgressRepository;
import dev.likeech.java.service.LessonProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LessonProgressServiceImpl implements LessonProgressService {
    private final LessonProgressRepository progressRepository;
    private final LessonProgressDTOConverter converter;
    @Override
    public LessonProgressDTO startLesson(User user, Lesson lesson) {
        Optional<LessonProgress> optionalProgress = progressRepository.findByUserAndLesson(user, lesson);        if (optionalProgress.isPresent()) {
            return converter.toDTO(optionalProgress.get());
        }
        try {
            LessonProgress newProgress = LessonProgress.builder()
                    .user(user)
                    .lesson(lesson)
                    .startedAt(LocalDateTime.now())
                    .isCompleted(false)
                    .build();

            LessonProgress saved = progressRepository.save(newProgress);
            return converter.toDTO(saved);

        } catch (DataIntegrityViolationException e) {
            LessonProgress progress = progressRepository.findByUserAndLesson(user, lesson)
                    .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND)); // điều này hiếm khi xảy ra
            return converter.toDTO(progress);
        }
    }

    @Override
    public LessonProgressDTO completeLesson(User user, Lesson lesson) {
        LessonProgress progress = progressRepository.findByUserAndLesson(user, lesson)
                .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));

        progress.setCompletedAt(LocalDateTime.now());
        progress.setIsCompleted(true);
        progressRepository.save(progress);

        return converter.toDTO(progress);
    }
}
