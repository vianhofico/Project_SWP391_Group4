package com.javaweb.service;

import com.javaweb.dto.response.admin.RatingDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RatingService {

    public Page<RatingDTO> getAllRatings(Long courseId, Pageable pageable);

}
