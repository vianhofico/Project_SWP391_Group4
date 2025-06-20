package dev.likeech.java.api.admin;
import dev.likeech.java.model.dto.LessonDTO;
import dev.likeech.java.model.request.LessonReorderRequest;
import dev.likeech.java.model.request.LessonRequest;
import dev.likeech.java.model.request.ChapterReorderRequest;
import dev.likeech.java.service.LessonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/chapter/{chapterId}/lessons")
@RequiredArgsConstructor
@Validated
public class LessonAPI {
    private final LessonService lessonService;

    @PostMapping
    public ResponseEntity<LessonDTO> createLessons(
            @PathVariable("chapterId") Long chapterId,
            @RequestBody @Valid LessonRequest request) {
        LessonDTO createdLesson = lessonService.createLesson(request,chapterId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdLesson);
    }
    @GetMapping()
    ResponseEntity<List<LessonDTO>> getChapters(@PathVariable("chapterId") Long chapterId ) {
        return ResponseEntity.status(HttpStatus.OK).body(lessonService.getLessons(chapterId));
    }
    @PutMapping("/reorder")
    public ResponseEntity<List<LessonDTO>> reorderLessons(
            @PathVariable ("chapterId") Long chapterId,
            @RequestBody List<LessonReorderRequest> request
    ) {
        List<LessonDTO> sortedChapters = lessonService.reorderLessons(chapterId, request);
        return ResponseEntity.ok(sortedChapters);
    }
    @PutMapping("/{lessonId}")
    public ResponseEntity<LessonDTO> updateChapterTitle(
            @PathVariable Long lessonId,
            @RequestBody @Valid LessonRequest request
    ) {

        return ResponseEntity.ok(lessonService.updateLesson(lessonId, request));
    }
}
