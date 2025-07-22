package com.javaweb.java.controller.user;

import com.javaweb.java.dtos.response.ChapterDTO;
import com.javaweb.java.services.ChapterService;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("public/user/course/{course_id}/chapters")
@RequiredArgsConstructor
@Validated
public class PublicUserChapterController {
    private final ChapterService chapterService;
    @GetMapping()
    public ResponseEntity<Page<ChapterDTO>> getChapters(
            @PathVariable("course_id")
            @Positive(message = "Course ID phải là số dương") Long courseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<ChapterDTO> result = chapterService.getActiveChapters(courseId, page, size);
        return ResponseEntity.ok(result);
    }
}
