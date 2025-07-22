package com.javaweb.controller.admin;

import dev.likeech.java.entity.Topic;
import dev.likeech.java.mapper.TopicDTOConverter;
import dev.likeech.java.model.dto.CourseDTO;
import dev.likeech.java.model.dto.TopicDTO;
import dev.likeech.java.model.request.CourseIdsRequest;
import dev.likeech.java.model.request.SearchRequest;
import dev.likeech.java.model.request.TopicRequest;
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
@RequestMapping("/admin/topics")
@Validated
@RequiredArgsConstructor
public class AdminTopicController {

private final TopicService topicService;
private final TopicDTOConverter topicDTOConverter;


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/inactive")
    public ResponseEntity<Page<TopicDTO>> getInactiveTopics(
            @RequestParam(name = "sort", required = false) String sortField,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "order", defaultValue = "asc", required = false) String order,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        var request = new SearchRequest(sortField, search, order, "false", page, size);
        return ResponseEntity.ok(topicService.searchByNameAndSort(request));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/active")
    public ResponseEntity<Page<TopicDTO>> getActiveTopics(
            @RequestParam(name = "sort", required = false) String sortField,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "order", defaultValue = "asc", required = false) String order,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "1") int size
    ) {
        var request = new SearchRequest(sortField, search, order, "true", page, size);
        return ResponseEntity.ok(topicService.searchByNameAndSort(request));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping()
    public ResponseEntity<List<TopicDTO>> getAllTopics(){
        return ResponseEntity.ok(topicService.getAllTopics());
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<TopicDTO> getTopic(@PathVariable @Positive Long id) {
        return  ResponseEntity.ok(topicDTOConverter.toTopicDTO(topicService.getTopic(id)));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Topic> createTopic(@RequestBody @Valid TopicRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(topicService.createTopic(request));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Topic> updateTopic(@PathVariable @Positive(message = "Id can't not positive number") Long id, @RequestBody TopicRequest request) {
        return ResponseEntity.ok(topicService.updateTopic(request,id));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{topicId}/courses")
    public ResponseEntity<List<CourseDTO>> addCourses(@PathVariable @Positive(message = "Id can't not positive number") Long topicId, @RequestBody CourseIdsRequest request) {
        return ResponseEntity.ok(topicService.addCourseInTopic(topicId,request));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{topicId}/courses")
    public ResponseEntity<List<CourseDTO>> deleteCourses(@PathVariable @Positive Long topicId, @RequestBody CourseIdsRequest request) {
        return ResponseEntity.ok(topicService.deleteCoursesInTopic(topicId,request));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Topic> deleteTopic(@PathVariable @Positive Long id) {
        return ResponseEntity.ok(topicService.deleteTopic(id));
    }
}
