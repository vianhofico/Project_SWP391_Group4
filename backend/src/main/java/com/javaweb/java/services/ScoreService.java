package com.javaweb.java.services;
import com.javaweb.java.dtos.response.ScoreDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ScoreService {

    Page<ScoreDTO> getAllScores(Long userId, Pageable pageable);

}
