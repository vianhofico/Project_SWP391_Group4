package dev.likeech.java.service;

import dev.likeech.java.model.request.CourseCreateRequest;
import dev.likeech.java.model.request.CourseUpdateRequest;
import dev.likeech.java.model.dto.CourseDTO;
import dev.likeech.java.entity.CourseEntity;
import dev.likeech.java.entity.TopicEntity;
import dev.likeech.java.model.request.SearchCourseRequest;
import dev.likeech.java.model.request.SearchRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface CourseService {
    List<CourseDTO> getAllCourseDtos();
    CourseDTO getCourse(Long id);
    CourseEntity createCourse(CourseCreateRequest request);
    List<CourseDTO> getCoursesNotInTopic(TopicEntity topic);
    CourseEntity updateCourse(CourseUpdateRequest request, Long id);
    Page<CourseDTO> filterAndSortCourses( SearchCourseRequest request);
    Page<CourseDTO> filterAndSort(List<CourseDTO> courses, SearchRequest request);
    List<CourseDTO> getCoursesInTopic(Long topicId);
}
