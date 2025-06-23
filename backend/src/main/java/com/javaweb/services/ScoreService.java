package com.javaweb.services;

import com.javaweb.dtos.response.admin.ScoreDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ScoreService {

    Page<ScoreDTO> getAllScores(Long userId, Pageable pageable);

}
