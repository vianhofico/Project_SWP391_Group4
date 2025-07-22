package com.javaweb.java.services;


import com.javaweb.java.entities.Order;
import com.javaweb.java.dtos.response.OrderDTO;
import com.javaweb.java.dtos.request.OrderSearchRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface OrderService {
    Optional<Order> getById(long id);
    Page<OrderDTO> getAllOrders(OrderSearchRequest orderSearchRequest, Pageable pageable);
    OrderDTO getOrderById(Long id);
    Long getIdOfLastOrder();
    List<Long> findPurchasedCourseIdsByUser(Long userId);
}
