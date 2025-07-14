package dev.likeech.java.mapper;

import dev.likeech.java.entity.Rating;
import dev.likeech.java.model.dto.RatingDTO;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class RatingDTOConverter {
    private final ModelMapper modelMapper;
    public RatingDTO toDTO(Rating rating) {
        RatingDTO ratingDTO = modelMapper.map(rating, RatingDTO.class);
        ratingDTO.setUserId(rating.getUser().getUserId());
        ratingDTO.setCourseId(rating.getCourse().getCourseId());
        return ratingDTO;
    }
}
