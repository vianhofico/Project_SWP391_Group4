package com.javaweb.java.services.impl;


import com.javaweb.java.entities.Score;
import com.javaweb.java.converter.DTOConverter;
import com.javaweb.java.dtos.response.ScoreDTO;
import com.javaweb.java.repositories.ScoreRepository;
import com.javaweb.java.services.ScoreService;
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
