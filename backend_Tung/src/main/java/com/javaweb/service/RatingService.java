package com.javaweb.services;

import com.javaweb.dtos.response.admin.RatingDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RatingService {

    Page<RatingDTO> getAllRatings(Long courseId, Pageable pageable);

}
