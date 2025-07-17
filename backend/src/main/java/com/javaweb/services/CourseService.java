package com.javaweb.services;

import com.javaweb.entities.Cart;
import com.javaweb.entities.Course;
import com.javaweb.entities.User;
import jakarta.servlet.http.HttpSession;

import java.util.List;

public interface CourseService {

    List<Course> getAllCourses();

    Cart fetchByUser(User user);

    void handleAddCourseToCart(long courseId);

    void handleRemoveCartItem(long id);

    void handlePlaceOrder(List<Long> cartItemIds);
}
