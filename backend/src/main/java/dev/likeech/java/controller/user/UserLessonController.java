package dev.likeech.java.controller.user;

import dev.likeech.java.entity.User;
import dev.likeech.java.model.dto.LessonDTO;
import dev.likeech.java.security.user.CustomUserDetails;
import dev.likeech.java.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
