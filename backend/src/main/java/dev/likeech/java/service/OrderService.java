package dev.likeech.java.service;


import dev.likeech.java.entity.Order;
import dev.likeech.java.model.dto.OrderDTO;
import dev.likeech.java.model.request.OrderSearchRequest;
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
