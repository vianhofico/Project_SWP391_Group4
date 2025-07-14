package dev.likeech.java.controller.admin;

import dev.likeech.java.entity.ResourceType;
import dev.likeech.java.model.dto.LessonResourceDTO;
import dev.likeech.java.model.request.ResourceCreateRequest;
import dev.likeech.java.model.request.ResourceFilterRequest;
import dev.likeech.java.service.LessonResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/resources")
@RequiredArgsConstructor
public class AdminLessonResourceController {
    private final LessonResourceService lessonResourceService;
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<LessonResourceDTO> createResource(
            @RequestBody @Valid ResourceCreateRequest request
    ) {
        LessonResourceDTO resourceDTO = lessonResourceService.createResource(request);
        return ResponseEntity.ok(resourceDTO);
    }
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/not-in-lesson/{lessonId}")
    public ResponseEntity<Page<LessonResourceDTO>> getResourcesNotInLesson(
            @PathVariable Long lessonId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String direction,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size
    ) {
        ResourceFilterRequest filter = new ResourceFilterRequest(title, type, sortBy, direction, page, size);
        Page<LessonResourceDTO> result = lessonResourceService.getResourcesNotInLesson(lessonId, filter);
        return ResponseEntity.ok(result);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{lessonId}/resources/assign")
    public ResponseEntity<Void> assignResourcesToLesson(
            @PathVariable Long lessonId,
            @RequestBody List<Long> resourceIds
    ) {
        lessonResourceService.assignResourcesToLesson(lessonId, resourceIds);
        return ResponseEntity.ok().build();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{lessonId}/resources/remove")
    public ResponseEntity<Void> removeResourcesFromLesson(
            @PathVariable Long lessonId,
            @RequestBody List<Long> resourceIds
    ) {
        lessonResourceService.removeResourcesFromLesson(lessonId, resourceIds);
        return ResponseEntity.ok().build();
    }

}
