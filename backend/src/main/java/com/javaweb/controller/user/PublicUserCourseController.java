package com.javaweb.controller.user;

import dev.likeech.java.enums.ResourceType;
import dev.likeech.java.model.dto.AttachmentDTO;
import dev.likeech.java.model.dto.CourseDTO;
import dev.likeech.java.model.request.SearchRequest;
import dev.likeech.java.service.AttachmentService;
import dev.likeech.java.service.CourseService;
import dev.likeech.java.service.TopicService;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/public/user/courses")
@RequiredArgsConstructor
@Validated
public class PublicUserCourseController {
    private final CourseService courseService;
    private final TopicService topicService;
    private final AttachmentService attachmentService;

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


    @GetMapping("{id}")
    public ResponseEntity<CourseDTO> getCourse(@PathVariable @Positive(message = "Id can't not positive number") Long id) {
        return ResponseEntity.ok(courseService.getCourse(id));
    }
    @GetMapping("/{courseId}/attachments")
    public ResponseEntity<List<AttachmentDTO>> getAttachmentsByCourse(
            @PathVariable Long courseId,
            @RequestParam(name = "type") ResourceType type
    ) {
        List<AttachmentDTO> attachments = attachmentService.getAttachments(courseId, type);
        return ResponseEntity.ok(attachments);
    }
}
