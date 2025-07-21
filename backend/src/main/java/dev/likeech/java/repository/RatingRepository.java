package dev.likeech.java.repository;

import dev.likeech.java.entity.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByUser_UserIdAndCourse_CourseId(Long userId, Long courseId);
    Page<Rating> findByUserUserId(Long userId, Pageable pageable);
}
