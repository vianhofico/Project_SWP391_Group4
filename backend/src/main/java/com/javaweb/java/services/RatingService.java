package com.javaweb.java.services;

import com.javaweb.java.dtos.response.RatingDTO;
import com.javaweb.java.dtos.request.RatingRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RatingService {
    RatingDTO rateCourse(RatingRequest request);
    Page<RatingDTO> getAllRatings(Long courseId, Pageable pageable);
}
