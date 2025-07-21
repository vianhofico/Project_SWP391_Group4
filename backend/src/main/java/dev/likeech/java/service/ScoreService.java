package dev.likeech.java.service;
import dev.likeech.java.model.dto.ScoreDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ScoreService {

    Page<ScoreDTO> getAllScores(Long userId, Pageable pageable);

}
