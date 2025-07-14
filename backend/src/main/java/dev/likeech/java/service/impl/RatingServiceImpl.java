package dev.likeech.java.service.impl;

import dev.likeech.java.entity.Course;
import dev.likeech.java.entity.Enrollment;
import dev.likeech.java.entity.Rating;
import dev.likeech.java.entity.User;
import dev.likeech.java.exp.AppException;
import dev.likeech.java.exp.ErrorCode;
import dev.likeech.java.mapper.RatingDTOConverter;
import dev.likeech.java.model.dto.RatingDTO;
import dev.likeech.java.model.request.RatingRequest;
import dev.likeech.java.repository.CourseRepository;
import dev.likeech.java.repository.EnrollmentRepository;
import dev.likeech.java.repository.RatingRepository;
import dev.likeech.java.repository.UserRepository;
import dev.likeech.java.service.RatingService;
import lombok.RequiredArgsConstructor;
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
        Enrollment enrollment = enrollmentRepository.findByUser_UserIdAndCourse_CourseId(request.getUserId(),request.getCourseId())
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
}
