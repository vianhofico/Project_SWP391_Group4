package com.javaweb.controller.user;

import com.javaweb.dtos.request.RatingRequest;
import com.javaweb.dtos.response.RatingDTO;
import com.javaweb.security.user.CustomUserDetails;
import com.javaweb.services.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
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
