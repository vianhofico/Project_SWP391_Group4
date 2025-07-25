package com.javaweb.repositories;

import com.javaweb.entities.Course;
import com.javaweb.entities.Enrollment;
import com.javaweb.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    Page<Enrollment> findByUserUserId(Long userId, Pageable pageable);
    Boolean existsByUserAndCourse(User user, Course course);
    Optional<Enrollment> findByUser_UserIdAndCourse_CourseId(Long userId, Long courseId);
    boolean existsByCourse_CourseId(Long courseId);
}
