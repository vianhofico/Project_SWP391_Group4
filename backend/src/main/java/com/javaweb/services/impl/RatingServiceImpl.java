package com.javaweb.services.impl;

import com.javaweb.converter.RatingDTOConverter;
import com.javaweb.dtos.request.RatingRequest;
import com.javaweb.dtos.response.RatingDTO;
import com.javaweb.entities.Course;
import com.javaweb.entities.Enrollment;
import com.javaweb.entities.Rating;
import com.javaweb.entities.User;
import com.javaweb.exceptions.AppException;
import com.javaweb.exceptions.ErrorCode;
import com.javaweb.repositories.CourseRepository;
import com.javaweb.repositories.EnrollmentRepository;
import com.javaweb.repositories.RatingRepository;
import com.javaweb.repositories.UserRepository;
import com.javaweb.services.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {
    private final RatingRepository ratingRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final RatingDTOConverter ratingDTOConverter;

    @Override
    public RatingDTO rateCourse(RatingRequest request) {
        Enrollment enrollment = enrollmentRepository.findByUser_UserIdAndCourse_CourseId(request.getUserId(), request.getCourseId())
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_ENROLLED));

        if (enrollment.getProgress() == null || enrollment.getProgress() < 100.0f) {
            throw new AppException(ErrorCode.COURSE_NOT_COMPLETED);
        }

        Optional<Rating> existingRatingOpt = ratingRepository.findByUser_UserIdAndCourse_CourseId(request.getUserId(), request.getCourseId());

        Rating rating;
        if (existingRatingOpt.isPresent()) {
            rating = existingRatingOpt.get();
            rating.setScore(request.getScore());
            rating.setComment(request.getComment());
            rating.setCreatedAt(LocalDateTime.now());
        } else {
            User user = userRepository.findById(request.getUserId()).orElseThrow();
            Course course = courseRepository.findById(request.getCourseId()).orElseThrow();

            rating = Rating.builder()
                    .user(user)
                    .course(course)
                    .score(request.getScore())
                    .comment(request.getComment())
                    .createdAt(LocalDateTime.now())
                    .build();
        }

        Rating savedRating = ratingRepository.save(rating);
        return ratingDTOConverter.toDTO(savedRating);
    }

    @Override
    public Page<RatingDTO> getAllRatings(Long userId, Pageable pageable) {
        Page<Rating> pageRatings = ratingRepository.findByUserUserId(userId, pageable);
        return pageRatings.map(ratingDTOConverter::toDTO);
    }
}
