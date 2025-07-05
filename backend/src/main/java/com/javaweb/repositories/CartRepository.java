package com.javaweb.repositories;

import com.javaweb.entities.Cart;
import com.javaweb.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Cart findByUser(User user);
    @Modifying
    @Query(value = "DELETE FROM carts WHERE cart_id = :cartId", nativeQuery = true)
    void deleteCartItemsByCartId(@Param("cartId") Long cartId);
}
