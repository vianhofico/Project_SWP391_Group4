package dev.likeech.java.service;

import dev.likeech.java.model.dto.RatingDTO;
import dev.likeech.java.model.request.RatingRequest;

public interface RatingService {
    RatingDTO rateCourse(RatingRequest request);
}
