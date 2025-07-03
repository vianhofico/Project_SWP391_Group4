package com.javaweb.repositories;

import com.javaweb.entities.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    Page<Rating> findByUserUserId(Long userId, Pageable pageable);

}
