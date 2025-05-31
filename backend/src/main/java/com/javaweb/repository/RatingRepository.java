package com.javaweb.repository;

import com.javaweb.entity.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    public Page<Rating> findByUserUserId(Long userId, Pageable pageable);

}
