package com.javaweb.java.repositories;

import com.javaweb.java.entities.Course;
import com.javaweb.java.entities.Enrollment;
import com.javaweb.java.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    Boolean existsByUserAndCourse(User user, Course course);
    Optional<Enrollment> findByUser_UserIdAndCourse_CourseId(Long userId, Long courseId);
    boolean existsByCourse_CourseId(Long courseId);
    Page<Enrollment> findByUserUserId(Long userId, Pageable pageable);
}
