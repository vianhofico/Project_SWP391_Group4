package dev.likeech.java.repository;

import dev.likeech.java.entity.Course;
import dev.likeech.java.entity.Enrollment;
import dev.likeech.java.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    Boolean existsByUserAndCourse(User user, Course course);
    Optional<Enrollment> findByUser_UserIdAndCourse_CourseId(Long userId, Long courseId);
}
