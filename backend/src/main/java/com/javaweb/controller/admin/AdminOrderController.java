package com.javaweb.controller.admin;


import dev.likeech.java.model.dto.OrderDTO;
import dev.likeech.java.model.dto.OrderItemDTO;
import dev.likeech.java.model.request.OrderSearchRequest;
import dev.likeech.java.service.OrderService;
import dev.likeech.java.service.impl.OrderServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/admin")
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
