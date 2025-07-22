package com.javaweb.java.repositories;


import com.javaweb.java.entities.Cart;
import com.javaweb.java.entities.CartItem;
import com.javaweb.java.entities.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    CartItem findByCartAndCourse(Cart cart, Course course);
}
