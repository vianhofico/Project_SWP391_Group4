package com.javaweb.repository;

import com.javaweb.entity.Cart;
import com.javaweb.entity.CartItem;
import com.javaweb.entity.dto.CourseDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    CartItem findByCartAndCourse(Cart cart, CourseDTO courseDTO);
}
