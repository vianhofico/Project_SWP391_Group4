package com.javaweb.java.controller.user;

import com.javaweb.java.dtos.response.LessonDTO;
import com.javaweb.java.services.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user/lesson")
@RequiredArgsConstructor
public class UserLessonController {
    private final LessonService lessonService;
    @PreAuthorize("hasAnyRole('LEARNER')")
    @GetMapping("/{lessonId}")
    public ResponseEntity<LessonDTO> getLessonDetail(
            @PathVariable Long lessonId,
            @AuthenticationPrincipal UserDetails userDetails) {

        LessonDTO lessonDTO = lessonService.getLessonDetailForUser(lessonId, userDetails.getUsername());
        return ResponseEntity.ok(lessonDTO);
    }

}
