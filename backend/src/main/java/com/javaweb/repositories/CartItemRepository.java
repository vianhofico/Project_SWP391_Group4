package com.javaweb.repositories;

import com.javaweb.entities.Cart;
import com.javaweb.entities.CartItem;
//import com.javaweb.entities.dto.response.CourseDTO;
import com.javaweb.entities.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    CartItem findByCartAndCourse(Cart cart, Course course);
}
