package com.javaweb.controller;

import com.javaweb.dtos.request.OrderSearchRequest;
import com.javaweb.dtos.response.OrderDTO;
import com.javaweb.dtos.response.OrderItemDTO;
import com.javaweb.services.OrderService;
import com.javaweb.services.impl.OrderServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin")
public class AdminOrderController {

    private final OrderService orderService;
    private final OrderServiceImpl orderServiceImpl;

    @GetMapping("/orders")
    public Page<OrderDTO> getAllOrders(@ModelAttribute OrderSearchRequest orderSearchRequest, Pageable pageable) {
        return orderService.getAllOrders(orderSearchRequest, pageable);
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<List<OrderItemDTO>> getOrderItems(@PathVariable long id){
        OrderDTO order = orderServiceImpl.getOrderById(id);

        List<OrderItemDTO> orderItems = order.getOrderItems();
        return ResponseEntity.ok(orderItems);
    }


}
