package com.javaweb.controller.user;

import com.javaweb.dtos.response.LessonDTO;
import com.javaweb.security.user.CustomUserDetails;
import com.javaweb.services.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user/chapters")
@RequiredArgsConstructor
public class UserChapterController {
    private final LessonService lessonService;
    @PreAuthorize("hasAnyRole('LEARNER')")
    @GetMapping("/{chapterId}/lessons")
    public ResponseEntity<List<LessonDTO>> getLessonsByChapterForUser(
            @PathVariable Long chapterId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getUser().getUserId();
        List<LessonDTO> lessons = lessonService.getActiveLessonsByChapterForUser(chapterId, userId);
        return ResponseEntity.ok(lessons);
    }
}
