package com.javaweb.java.services.impl;


import com.javaweb.java.dtos.response.CourseRevenueDTO;
import com.javaweb.java.repositories.OrderItemRepository;
import com.javaweb.java.services.OrderStatisticService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderStatisticServiceImpl implements OrderStatisticService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    public List<CourseRevenueDTO> getAllStats() {
        return orderItemRepository.getCourseRevenueStats();
    }

    public List<CourseRevenueDTO> getStatsBetween(LocalDateTime start, LocalDateTime end) {
        return orderItemRepository.getCourseRevenueStatsBetween(start, end);
    }
}
