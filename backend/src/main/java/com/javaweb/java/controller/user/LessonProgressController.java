package com.javaweb.java.controller.user;

import com.javaweb.java.entities.Lesson;
import com.javaweb.java.entities.User;
import com.javaweb.java.exceptions.AppException;
import com.javaweb.java.exceptions.ErrorCode;
import com.javaweb.java.dtos.response.LessonProgressDTO;
import com.javaweb.java.repositories.LessonRepository;
import com.javaweb.java.security.user.CustomUserDetails;
import com.javaweb.java.services.LessonProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user/lesson-progress")
@RequiredArgsConstructor
public class LessonProgressController {
    private final LessonProgressService progressService;
    private final LessonRepository lessonRepository;
    @PreAuthorize("hasAnyRole('LEARNER')")
    @PostMapping("/{lessonId}/start")
    public ResponseEntity<?> startLesson(@PathVariable Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        LessonProgressDTO progress = progressService.startLesson(user, lesson);
        return ResponseEntity.ok(progress);
    }
    @PreAuthorize("hasAnyRole('LEARNER')")
    @PostMapping("/{lessonId}/complete")
    public ResponseEntity<?> completeLesson(@PathVariable Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        LessonProgressDTO progress = progressService.completeLesson(user, lesson);
        return ResponseEntity.ok(progress);
    }
}
