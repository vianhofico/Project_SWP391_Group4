package com.javaweb.services;

import com.javaweb.entities.Cart;
import com.javaweb.entities.Course;
import com.javaweb.entities.User;
import jakarta.servlet.http.HttpSession;

import java.util.List;

public interface CourseService {

    List<Course> getAllCourses();

    Cart fetchByUser(User user);

//    void handleAddCourseToCart(String email, long courseId, HttpSession session);

    void handleAddCourseToCart(long courseId, HttpSession session);

    void handleRemoveCartItem(long id, HttpSession session);

//    void handlePlaceOrder(User user, HttpSession session, List<Long> cartItemIds);

    void handlePlaceOrder(HttpSession session, List<Long> cartItemIds);




}
