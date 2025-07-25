package com.javaweb.services;

import com.javaweb.dtos.request.RatingRequest;
import com.javaweb.dtos.response.RatingDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RatingService {
    RatingDTO rateCourse(RatingRequest request);
    Page<RatingDTO> getAllRatings(Long courseId, Pageable pageable);
}
