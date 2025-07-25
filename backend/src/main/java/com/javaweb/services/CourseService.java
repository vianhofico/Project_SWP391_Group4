package com.javaweb.services;

import com.javaweb.dtos.request.CourseCreateRequest;
import com.javaweb.dtos.request.CourseUpdateRequest;
import com.javaweb.dtos.request.SearchCourseRequest;
import com.javaweb.dtos.request.SearchRequest;
import com.javaweb.dtos.response.CourseDTO;
import com.javaweb.entities.Cart;
import com.javaweb.entities.Course;
import com.javaweb.entities.Topic;
import com.javaweb.entities.User;
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
