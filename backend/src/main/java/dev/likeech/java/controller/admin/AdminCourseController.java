package dev.likeech.java.controller.admin;

import dev.likeech.java.enums.ResourceType;
import dev.likeech.java.model.dto.AttachmentDTO;
import dev.likeech.java.model.request.*;
import dev.likeech.java.model.dto.CourseDTO;
import dev.likeech.java.entity.Course;
import dev.likeech.java.service.AttachmentService;
import dev.likeech.java.service.CourseService;
import dev.likeech.java.service.TopicService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/courses")
@RequiredArgsConstructor
@Validated
public class AdminCourseController {

    private final CourseService courseService;
    private final TopicService topicService;
    private final AttachmentService attachmentService;
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/topics/{topicId}/courses")
    public ResponseEntity<Page<CourseDTO>> getCoursesInTopic(
            @PathVariable Long topicId,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "sort", required = false) String sort,
            @RequestParam(name = "order", defaultValue = "asc") String order,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        SearchRequest request = new SearchRequest(sort, search, order, status, page, size);

        List<CourseDTO> courses;
        if (topicId == 0) {
            courses = courseService.getAllCourseDtos();
        } else {
            courses = courseService.getCoursesInTopic(topicId);
        }

        Page<CourseDTO> pagedCourses = courseService.filterAndSort(courses, request);
        return ResponseEntity.ok(pagedCourses);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/topics/{topicId}")
    public ResponseEntity<Page<CourseDTO>> getAllCourses(
            @PathVariable Long topicId,
            @RequestParam(name = "sort", required = false) String sortField,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "order", defaultValue = "asc") String order,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        SearchCourseRequest request = new SearchCourseRequest(
                sortField, search, order, status, page, size, topicId
        );
        Page<CourseDTO> result = courseService.filterAndSortCourses(request);
        return ResponseEntity.ok(result);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/topics/{topicId}/available-courses")
    public ResponseEntity<Page<CourseDTO>> getAvailableCoursesForTopic(
            @PathVariable @Positive(message = "Topic ID must be positive") Long topicId,
            @RequestParam(name = "sort", required = false) String sortField,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "order", defaultValue = "asc") String order,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        SearchRequest request = new SearchRequest(sortField, search, order, status, page, size);
        var topic = topicService.getTopic(topicId);
        List<CourseDTO> courses = courseService.getCoursesNotInTopic(topic);

        Page<CourseDTO> pagedCourses = courseService.filterAndSort(courses, request);
        return ResponseEntity.ok(pagedCourses);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping()
    public ResponseEntity<Course> createCourse(@RequestBody @Valid CourseCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(courseService.createCourse(request));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable @Positive Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable @Positive(message = "Id can't not positive number") Long id,
                                               @RequestBody @Valid CourseUpdateRequest request) {
        return ResponseEntity.ok(courseService.updateCourse(request, id));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("{id}")
    public ResponseEntity<CourseDTO> getCourse(@PathVariable @Positive(message = "Id can't not positive number") Long id) {
        return ResponseEntity.ok(courseService.getCourse(id));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{courseId}/attachments")
    public ResponseEntity<List<AttachmentDTO>> getAttachmentsByCourse(
            @PathVariable Long courseId,
            @RequestParam(name = "type") ResourceType type
    ) {
        List<AttachmentDTO> attachments = attachmentService.getAttachments(courseId, type);
        return ResponseEntity.ok(attachments);
    }


}
