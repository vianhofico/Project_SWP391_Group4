package com.javaweb.java.repositories;


import com.javaweb.java.entities.Cart;
import com.javaweb.java.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByUserUserId(Long userId);

    Cart findByUser(User user);
    @Modifying
    @Query(value = "DELETE FROM carts WHERE cart_id = :cartId", nativeQuery = true)
    void deleteCartItemsByCartId(@Param("cartId") Long cartId);

}
