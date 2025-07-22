package com.javaweb.java.controller.user;

import com.javaweb.java.enums.ResourceType;
import com.javaweb.java.dtos.response.LessonResourceDTO;
import com.javaweb.java.dtos.request.ResourceFilterRequest;
import com.javaweb.java.services.LessonResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user/resources")
@RequiredArgsConstructor
public class UserLessonResourceController {
    private final LessonResourceService lessonResourceService;
    @PreAuthorize("hasRole('LEARNER')")
    @GetMapping("/in-lesson/{lessonId}")
    public ResponseEntity<Page<LessonResourceDTO>> getResourcesInLesson(
            @PathVariable Long lessonId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String direction,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size
    ) {
        ResourceFilterRequest filter = new ResourceFilterRequest(title, type, sortBy, direction, page, size);
        Page<LessonResourceDTO> result = lessonResourceService.getResourcesInLesson(lessonId, filter);
        return ResponseEntity.ok(result);
    }
}
