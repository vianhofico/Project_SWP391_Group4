package com.javaweb.repository;

import com.javaweb.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {

    public Cart findByUserUserId(Long userId);

}
