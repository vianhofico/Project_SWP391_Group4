package dev.likeech.java.api.admin;

import dev.likeech.java.model.dto.ChapterDTO;
import dev.likeech.java.model.request.ChapterReorderRequest;
import dev.likeech.java.service.ChapterService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/course/{courseid}/chapters")
@RequiredArgsConstructor
@Validated
public class ChapterAPI {
    private final ChapterService chapterService;

    @PostMapping
    public ResponseEntity<List<ChapterDTO>> createChapters(
            @PathVariable("courseid") Long courseId,
            @RequestBody @NotEmpty(message = "Chapter titles cannot be empty") List<@NotBlank String> titles) {
        List<ChapterDTO> createdChapters = chapterService.createChapters(titles, courseId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdChapters);
    }
    @GetMapping()
    ResponseEntity<List<ChapterDTO>> getChapters(@PathVariable("courseid") Long courseId) {
        return ResponseEntity.status(HttpStatus.OK).body(chapterService.getChapters(courseId));
    }
    @PutMapping("/reorder")
    public ResponseEntity<List<ChapterDTO>> reorderChapters(
            @PathVariable Long courseid,
            @RequestBody List<ChapterReorderRequest> request
    ) {
        List<ChapterDTO> sortedChapters = chapterService.reorderChapters(courseid, request);
        return ResponseEntity.ok(sortedChapters);
    }
    @PutMapping("/{chapterId}")
    public ResponseEntity<Void> updateChapterTitle(
            @PathVariable Long chapterId,
            @RequestBody @NotBlank  String title
    ) {
        chapterService.updateChapterTitle(chapterId, title);
        return ResponseEntity.ok().build();
    }

}
