package dev.likeech.java.repository;


import dev.likeech.java.entity.Cart;
import dev.likeech.java.entity.CartItem;
import dev.likeech.java.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    CartItem findByCartAndCourse(Cart cart, Course course);
}
