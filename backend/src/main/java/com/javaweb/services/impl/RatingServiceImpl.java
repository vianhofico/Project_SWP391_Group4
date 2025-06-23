package com.javaweb.services.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dtos.response.admin.RatingDTO;
import com.javaweb.entities.Rating;
import com.javaweb.repositories.RatingRepository;
import com.javaweb.services.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final DTOConverter dtoConverter;

    @Override
    public Page<RatingDTO> getAllRatings(Long userId, Pageable pageable) {
        Page<Rating> pageRatings = ratingRepository.findByUserUserId(userId, pageable);
        return pageRatings.map(dtoConverter::toRatingDTO);
    }
}
