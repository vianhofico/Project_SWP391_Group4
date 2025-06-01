package com.javaweb.service;

import com.javaweb.dto.response.admin.ScoreDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ScoreService {

    public Page<ScoreDTO> getAllScores(Long userId, Pageable pageable);

}
