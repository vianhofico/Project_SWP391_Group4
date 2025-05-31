package com.javaweb.repository;

import com.javaweb.entity.Score;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScoreRepository extends JpaRepository<Score, Long> {

    public Page<Score> findByUserUserId(Long userId, Pageable pageable);

}
