package com.javaweb.controller.user;

import dev.likeech.java.model.dto.RatingDTO;
import dev.likeech.java.model.request.RatingRequest;
import dev.likeech.java.security.user.CustomUserDetails;
import dev.likeech.java.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequiredArgsConstructor
public class RatingController {
    private final RatingService ratingService;
    @PreAuthorize("hasAnyRole('LEARNER')")
    @PostMapping("/ratings")
    public ResponseEntity<RatingDTO> createOrUpdateRating(@RequestBody RatingRequest request,
                                                          @AuthenticationPrincipal CustomUserDetails userDetails) {
        request.setUserId(userDetails.getUser().getUserId());
        RatingDTO ratingDTO = ratingService.rateCourse(request);
        return ResponseEntity.ok(ratingDTO);
    }
}
