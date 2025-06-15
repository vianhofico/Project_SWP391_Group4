package com.javaweb.services.impl;


import com.javaweb.dtos.CourseDTO;
import com.javaweb.entities.Course;
import com.javaweb.exceptions.ResourceNotFoundException;
import com.javaweb.repositories.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;



    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public List<Course> searchCourses(String keyword) {
        return courseRepository.searchCourses(keyword);
    }


    public Course getCourseById(Integer id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
    }

    public Course createCourse(CourseDTO courseDTO) {
        Course course = new Course();
        mapCourseDTOToEntity(courseDTO, course);
        return courseRepository.save(course);
    }

    public Course updateCourse(Integer id, CourseDTO courseDTO) {
        Course course = getCourseById(id);
        mapCourseDTOToEntity(courseDTO, course);
        return courseRepository.save(course);
    }

    public void deleteCourse(Integer id) {
        Course course = getCourseById(id);
        courseRepository.delete(course);
    }

    private void mapCourseDTOToEntity(CourseDTO dto, Course entity) {
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setPrice(dto.getPrice());
        entity.setRating(dto.getRating());
        entity.setImageUrl(dto.getImageUrl());
        entity.setVideoTrialUrl(dto.getVideoTrialUrl());
        entity.setStatus(dto.getStatus());
    }
}