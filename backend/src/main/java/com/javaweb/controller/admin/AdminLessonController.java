package com.javaweb.controller.admin;
import dev.likeech.java.model.dto.LessonDTO;
import dev.likeech.java.model.request.LessonReorderRequest;
import dev.likeech.java.model.request.LessonRequest;
import dev.likeech.java.service.LessonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/chapter/{chapterId}/lessons")
@RequiredArgsConstructor
@Validated
public class AdminLessonController {
    private final LessonService lessonService;
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<LessonDTO> createLessons(
            @PathVariable("chapterId") Long chapterId,
            @RequestBody @Valid LessonRequest request) {
        LessonDTO createdLesson = lessonService.createLesson(request,chapterId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdLesson);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{lessonId}")
    public ResponseEntity<Void> deleteLessons(@PathVariable("lessonId") Long lessonId) {
        lessonService.deleteLesson(lessonId);
        return ResponseEntity.noContent().build();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping()
    ResponseEntity<List<LessonDTO>> getChapters(@PathVariable("chapterId") Long chapterId ) {
        return ResponseEntity.status(HttpStatus.OK).body(lessonService.getLessons(chapterId));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/reorder")
    public ResponseEntity<List<LessonDTO>> reorderLessons(
            @PathVariable ("chapterId") Long chapterId,
            @RequestBody List<LessonReorderRequest> request
    ) {
        List<LessonDTO> sortedChapters = lessonService.reorderLessons(chapterId, request);
        return ResponseEntity.ok(sortedChapters);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{lessonId}")
    public ResponseEntity<LessonDTO> updateChapterTitle(
            @PathVariable Long lessonId,
            @RequestBody @Valid LessonRequest request
    ) {

        return ResponseEntity.ok(lessonService.updateLesson(lessonId, request));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("{lessonId}")
    ResponseEntity<LessonDTO> getLesson(@PathVariable("lessonId") Long lessonId) {
        return ResponseEntity.ok(lessonService.getLesson(lessonId));
    }
}
