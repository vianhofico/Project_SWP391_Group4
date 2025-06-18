package dev.likeech.java.service;

import dev.likeech.java.model.request.CourseCreateRequest;
import dev.likeech.java.model.request.CourseUpdateRequest;
import dev.likeech.java.model.dto.CourseDTO;
import dev.likeech.java.repository.entity.CourseEntity;
import dev.likeech.java.repository.entity.TopicEntity;
import java.util.List;

public interface CourseService {
    List<CourseDTO> getAllCourseDtos();
    CourseDTO getCourse(Long id);
    CourseEntity createCourse(CourseCreateRequest request);
    List<CourseDTO> getCoursesNotInTopic(TopicEntity topic);
    CourseEntity updateCourse(CourseUpdateRequest request, Long id);
    List<CourseDTO> getCoursesInTopic(Long topicId);
    List<CourseDTO> searchCourses(List<CourseDTO> courses, String keyword);
    List<CourseDTO> sortCourses(List<CourseDTO> courses, String sortBy, String orderBy);
    List<CourseDTO> filterAndSortCourses(List<CourseDTO> courses,String keyword, String sortBy, String orderBy);
}
