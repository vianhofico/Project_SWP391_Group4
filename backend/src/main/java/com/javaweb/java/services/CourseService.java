package com.javaweb.java.services;

import com.javaweb.java.entities.Cart;
import com.javaweb.java.entities.User;
import com.javaweb.java.dtos.request.CourseCreateRequest;
import com.javaweb.java.dtos.request.CourseUpdateRequest;
import com.javaweb.java.dtos.response.CourseDTO;
import com.javaweb.java.entities.Course;
import com.javaweb.java.entities.Topic;
import com.javaweb.java.dtos.request.SearchCourseRequest;
import com.javaweb.java.dtos.request.SearchRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface CourseService {
    List<CourseDTO> getAllCourseDtos();
    CourseDTO getCourse(Long id);
    Course createCourse(CourseCreateRequest request);
    List<CourseDTO> getCoursesNotInTopic(Topic topic);
    Course updateCourse(CourseUpdateRequest request, Long id);
    Page<CourseDTO> filterAndSortCourses( SearchCourseRequest request);
    Page<CourseDTO> filterAndSort(List<CourseDTO> courses, SearchRequest request);
    List<CourseDTO> getCoursesInTopic(Long topicId);
    void deleteCourse(Long id);
    CourseDTO getCourseWithProgress(Long courseId, Long userId);
    List<Course> getAllCourses();

    Cart fetchByUser(User user);

    void handleAddCourseToCart(long courseId);

    void handleRemoveCartItem(long id);

    void handlePlaceOrder(List<Long> cartItemIds);
}
