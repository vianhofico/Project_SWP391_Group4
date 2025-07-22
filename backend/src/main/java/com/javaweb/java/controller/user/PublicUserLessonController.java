package com.javaweb.java.controller.user;

import com.javaweb.java.dtos.response.LessonDTO;
import com.javaweb.java.services.LessonService;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public/user/chapter/{chapter_id}/lessons")
@RequiredArgsConstructor
@Validated
public class PublicUserLessonController {
    private final LessonService lessonService;
    @GetMapping()
    public ResponseEntity<Page<LessonDTO>> getLessons(
            @PathVariable("chapter_id") @NotNull @Positive(message = "id can't not be positive number")Long chapterId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<LessonDTO> result = lessonService.getActiveLessons(chapterId, page, size);
        return ResponseEntity.ok(result);
    }
}
