package com.javaweb.java.repositories;

import com.javaweb.java.entities.Score;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScoreRepository extends JpaRepository<Score, Long> {

    Page<Score> findByUserUserId(Long userId, Pageable pageable);

}
