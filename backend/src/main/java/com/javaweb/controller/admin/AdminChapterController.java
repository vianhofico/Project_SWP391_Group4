package com.javaweb.controller.admin;

import com.javaweb.dtos.request.ChapterReorderRequest;
import com.javaweb.dtos.response.ChapterDTO;
import com.javaweb.services.ChapterService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import org.checkerframework.checker.index.qual.Positive;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/course/{courseid}/chapters")
@RequiredArgsConstructor
@Validated
public class AdminChapterController {
    private final ChapterService chapterService;
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<List<ChapterDTO>> createChapters(
            @PathVariable("courseid") Long courseId,
            @RequestBody @NotEmpty(message = "Chapter titles cannot be empty") List<@NotBlank String> titles) {
        List<ChapterDTO> createdChapters = chapterService.createChapters(titles, courseId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdChapters);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping()
    public ResponseEntity<Page<ChapterDTO>> getChapters(
            @PathVariable ("courseid") Long courseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<ChapterDTO> result = chapterService.getChapters(courseId, page, size);
        return ResponseEntity.ok(result);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{chapterId}")
    public ResponseEntity<Void> deleteChapter(
            @PathVariable @Positive Long chapterId
    ){
        chapterService.deleteChapter(chapterId);
        return ResponseEntity.noContent().build();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/reorder")
    public ResponseEntity<List<ChapterDTO>> reorderChapters(
            @PathVariable Long courseid,
            @RequestBody List<ChapterReorderRequest> request
    ) {
        List<ChapterDTO> sortedChapters = chapterService.reorderChapters(courseid, request);
        return ResponseEntity.ok(sortedChapters);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{chapterId}/update-title")
    public ResponseEntity<Void> updateChapterTitle(
            @PathVariable Long chapterId,
            @RequestBody @NotBlank  String title
    ) {
        chapterService.updateChapterTitle(chapterId, title);
        return ResponseEntity.ok().build();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{chapterId}/update-status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable Long chapterId,
            @RequestBody @NotBlank  String status
    ){
        chapterService.updateChapterStatus(chapterId, status);
        return ResponseEntity.ok().build();
    }
}
