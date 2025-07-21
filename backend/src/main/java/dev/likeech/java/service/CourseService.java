package dev.likeech.java.service;

import dev.likeech.java.entity.Cart;
import dev.likeech.java.entity.User;
import dev.likeech.java.model.request.CourseCreateRequest;
import dev.likeech.java.model.request.CourseUpdateRequest;
import dev.likeech.java.model.dto.CourseDTO;
import dev.likeech.java.entity.Course;
import dev.likeech.java.entity.Topic;
import dev.likeech.java.model.request.SearchCourseRequest;
import dev.likeech.java.model.request.SearchRequest;
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
