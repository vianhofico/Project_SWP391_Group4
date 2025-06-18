package dev.likeech.java.api.admin;

import dev.likeech.java.model.request.CourseCreateRequest;
import dev.likeech.java.model.request.CourseUpdateRequest;
import dev.likeech.java.model.dto.CourseDTO;
import dev.likeech.java.repository.entity.CourseEntity;
import dev.likeech.java.service.CourseService;
import dev.likeech.java.service.TopicService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/courses")
@RequiredArgsConstructor
@Validated
public class CourseAPI {

    private final CourseService courseService;
    private final TopicService topicService;

    // Lấy danh sách khóa học trong topic
    @GetMapping("/topics/{topicId}/courses")
    public ResponseEntity<List<CourseDTO>> getCoursesInTopic(
            @PathVariable  Long topicId,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "sort", required = false) String sort,
            @RequestParam(name = "order", required = false) String order
    ) {
        if(topicId == 0){
            List<CourseDTO> courses = courseService.getAllCourseDtos();
            List<CourseDTO> filteredCourses = courseService.filterAndSortCourses(courses, search, sort, order);
            return ResponseEntity.ok(filteredCourses);
        }
        List<CourseDTO> courses = courseService.getCoursesInTopic(topicId);
        List<CourseDTO> filteredCourses = courseService.filterAndSortCourses(courses, search, sort, order);
        return ResponseEntity.ok(filteredCourses);
    }

    // Lấy khóa học chưa thuộc topic (available courses)
    @GetMapping("/topics/{topicId}/available-courses")
    public ResponseEntity<List<CourseDTO>> getAvailableCoursesForTopic(
            @PathVariable @Positive(message = "Topic ID must be positive") Long topicId,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "sort", required = false) String sort,
            @RequestParam(name = "order", required = false) String order
    ) {
        // Lấy topic entity theo ID
        var topic = topicService.getTopic(topicId);
        List<CourseDTO> courses = courseService.getCoursesNotInTopic(topic);
        // Lọc và sắp xếp
        List<CourseDTO> filteredCourses = courseService.filterAndSortCourses(courses, search, sort, order);
        return ResponseEntity.ok(filteredCourses);
    }

    @PostMapping()
    public ResponseEntity<CourseEntity> createCourse(@RequestBody @Valid CourseCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(courseService.createCourse(request));
    }
    @PutMapping("/{id}")
    public ResponseEntity<CourseEntity> updateCourse(@PathVariable @Positive(message = "Id can't not positive number") Long id,
            @RequestBody @Valid CourseUpdateRequest request) {
        return ResponseEntity.ok(courseService.updateCourse(request, id));
    }
    @GetMapping("{id}")
    public ResponseEntity<CourseDTO> getCourse(@PathVariable @Positive(message = "Id can't not positive number") Long id) {
        return ResponseEntity.ok(courseService.getCourse(id));
    }
}
