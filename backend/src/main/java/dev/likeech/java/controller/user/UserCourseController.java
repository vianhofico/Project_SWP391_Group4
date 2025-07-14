package dev.likeech.java.controller.user;

import dev.likeech.java.model.dto.CourseDTO;
import dev.likeech.java.security.user.CustomUserDetails;
import dev.likeech.java.service.CourseService;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user/courses")
@RequiredArgsConstructor
@Validated
public class UserCourseController {
    private final CourseService courseService;
    @PreAuthorize("hasAnyRole('LEARNER')")
    @GetMapping("{id}")
    public ResponseEntity<CourseDTO> getCourse(@PathVariable @Positive(message = "Id can't not positive number") Long id,
                                               @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(courseService.getCourseWithProgress(id,userDetails.getUser().getUserId()));
    }
}
