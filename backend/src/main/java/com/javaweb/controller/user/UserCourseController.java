package com.javaweb.controller.user;

import com.javaweb.dtos.response.CourseDTO;
import com.javaweb.security.user.CustomUserDetails;
import com.javaweb.services.CourseService;
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
@RequestMapping("/api/user/courses")
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
