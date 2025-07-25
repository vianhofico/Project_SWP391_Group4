package com.javaweb.repositories;

import com.javaweb.dtos.response.CourseRevenueDTO;
import com.javaweb.entities.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Query(value = """
                SELECT new com.javaweb.dtos.response.CourseRevenueDTO(
                    oi.course.courseId,
                    oi.course.title,
                    SUM(oi.price),
                    COUNT(o.user.userId)
                )
                FROM OrderItem oi
                JOIN oi.order o
                GROUP BY oi.course.courseId, oi.course.title
            """)
    List<CourseRevenueDTO> getCourseRevenueStatus();

    @Query("""
        SELECT new com.javaweb.dtos.response.CourseRevenueDTO(
            oi.course.courseId,
            oi.course.title,
            SUM(oi.price),
            COUNT(DISTINCT o.user.userId)
        )
        FROM OrderItem oi
        JOIN oi.order o
        WHERE o.createdAt BETWEEN :start AND :end
        GROUP BY oi.course.courseId, oi.course.title
    """)
    List<CourseRevenueDTO> getCourseRevenueStatusBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
