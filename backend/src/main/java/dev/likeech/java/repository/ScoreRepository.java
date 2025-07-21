package dev.likeech.java.repository;

import dev.likeech.java.entity.Score;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScoreRepository extends JpaRepository<Score, Long> {

    Page<Score> findByUserUserId(Long userId, Pageable pageable);

}
