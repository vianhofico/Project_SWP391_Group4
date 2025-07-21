package dev.likeech.java.repository;


import dev.likeech.java.entity.Order;
import dev.likeech.java.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
    Page<Order> findAll(Pageable pageable);
    @Query("SELECT DISTINCT oi.course.courseId FROM Order o JOIN o.orderItems oi WHERE o.user.userId = :userId")
    List<Long> findPurchasedCourseIdsByUser(@Param("userId") Long userId);

    Order findTopByUserOrderByCreatedAtDesc(User user);
}
