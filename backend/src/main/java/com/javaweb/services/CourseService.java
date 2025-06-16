package com.javaweb.services;

import com.javaweb.entities.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface CourseService {
    Page<Course> getAllCourses(Pageable pageable);
    Page<Course> searchCourses(String keyword, Boolean status, Pageable pageable);
    Optional<Course> getCourseById(Long id);
}
