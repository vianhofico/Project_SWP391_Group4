package com.javaweb.services.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dtos.response.admin.ScoreDTO;
import com.javaweb.entities.Score;
import com.javaweb.repositories.ScoreRepository;
import com.javaweb.services.ScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ScoreServiceImpl implements ScoreService {

    private final ScoreRepository scoreRepository;
    private final DTOConverter dtoConverter;

    @Override
    public Page<ScoreDTO> getAllScores(Long userId, Pageable pageable) {
        Page<Score> pageScores = scoreRepository.findByUserUserId(userId, pageable);
        return pageScores.map(dtoConverter::toScoreDTO);
    }
}
