package dev.likeech.java.api.admin;
import dev.likeech.java.mapper.TopicDTOConverter;
import dev.likeech.java.model.request.CourseIdsRequest;
import dev.likeech.java.model.dto.CourseDTO;
import dev.likeech.java.model.dto.TopicDTO;
import dev.likeech.java.model.request.SearchRequest;
import dev.likeech.java.model.request.TopicRequest;
import dev.likeech.java.repository.entity.TopicEntity;
import dev.likeech.java.service.TopicService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


import java.util.List;
@RestController
@RequestMapping("/admin/topics")
@Validated
public class TopicAPI {

    private final TopicService topicService;
    private final TopicDTOConverter topicDTOConverter;

    public TopicAPI(TopicService topicService, TopicDTOConverter topicDTOConverter) {
        this.topicService = topicService;
        this.topicDTOConverter = topicDTOConverter;
    }

    @GetMapping
    public ResponseEntity<List<TopicDTO>> getTopics(
            @RequestParam(name = "sort", required = false) String sortField,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "order", defaultValue = "asc", required = false) String order,
            @RequestParam(name = "status", required = false) String statusStr
    ) {
        var request = new SearchRequest(sortField, search, order, statusStr);
        return ResponseEntity.ok(topicService.searchByNameAndSort(request));
    }
    @GetMapping("/{id}")
    public ResponseEntity<TopicDTO> getTopic(@PathVariable @Positive Long id) {
        return  ResponseEntity.ok(topicDTOConverter.toTopicDTO(topicService.getTopic(id)));
    }

    @PostMapping
    public ResponseEntity<TopicEntity> createTopic(@RequestBody @Valid TopicRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(topicService.createTopic(request));
    }
    @PutMapping("/{id}")
    public ResponseEntity<TopicEntity> updateTopic(@PathVariable @Positive(message = "Id can't not positive number") Long id, @RequestBody TopicRequest request) {
        return ResponseEntity.ok(topicService.updateTopic(request,id));
    }
    @PostMapping("/{topicId}/courses")
    public ResponseEntity<List<CourseDTO>> addCourses(@PathVariable @Positive(message = "Id can't not positive number") Long topicId, @RequestBody CourseIdsRequest request) {
        return ResponseEntity.ok(topicService.addCourseInTopic(topicId,request));
    }
    @DeleteMapping("/{topicId}/courses")
    public ResponseEntity<List<CourseDTO>> deleteCourses(@PathVariable @Positive Long topicId, @RequestBody CourseIdsRequest request) {
        return ResponseEntity.ok(topicService.deleteCoursesInTopic(topicId,request));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<TopicEntity> deleteTopic(@PathVariable @Positive Long id) {
        return ResponseEntity.ok(topicService.deleteTopic(id));
    }
}
