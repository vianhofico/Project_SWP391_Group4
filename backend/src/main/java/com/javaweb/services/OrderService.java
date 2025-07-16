package com.javaweb.services;

import com.javaweb.dtos.request.OrderSearchRequest;
import com.javaweb.dtos.response.OrderDTO;
import com.javaweb.entities.Order;
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
