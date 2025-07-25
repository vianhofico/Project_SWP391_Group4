package com.javaweb.controller.user;

import com.javaweb.dtos.request.ResourceFilterRequest;
import com.javaweb.dtos.response.LessonResourceDTO;
import com.javaweb.enums.ResourceType;
import com.javaweb.services.LessonResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/resources")
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
