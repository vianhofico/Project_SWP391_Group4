package dev.likeech.java.service;

import dev.likeech.java.model.dto.RatingDTO;
import dev.likeech.java.model.request.RatingRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RatingService {
    RatingDTO rateCourse(RatingRequest request);
    Page<RatingDTO> getAllRatings(Long courseId, Pageable pageable);
}
