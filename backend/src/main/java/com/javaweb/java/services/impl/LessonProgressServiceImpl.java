package com.javaweb.java.services.impl;

import com.javaweb.java.entities.Lesson;
import com.javaweb.java.entities.LessonProgress;
import com.javaweb.java.entities.User;
import com.javaweb.java.exceptions.AppException;
import com.javaweb.java.exceptions.ErrorCode;
import com.javaweb.java.converter.LessonProgressDTOConverter;
import com.javaweb.java.dtos.response.LessonProgressDTO;
import com.javaweb.java.repositories.LessonProgressRepository;
import com.javaweb.java.services.LessonProgressService;
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
