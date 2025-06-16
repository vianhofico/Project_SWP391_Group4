package com.javaweb.service;

import com.javaweb.entity.Order;
import com.javaweb.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class OrderService {
    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Optional<Order> getById(long id){
        return this.orderRepository.findById(id);
    }

}
