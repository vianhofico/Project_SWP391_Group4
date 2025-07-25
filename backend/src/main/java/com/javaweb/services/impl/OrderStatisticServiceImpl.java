package com.javaweb.services.impl;


import com.javaweb.dtos.response.CourseRevenueDTO;
import com.javaweb.repositories.OrderItemRepository;
import com.javaweb.services.OrderStatisticService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderStatisticServiceImpl implements OrderStatisticService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    public List<CourseRevenueDTO> getAllStats() {
        return orderItemRepository.getCourseRevenueStatus();
    }

    public List<CourseRevenueDTO> getStatsBetween(LocalDateTime start, LocalDateTime end) {
        return orderItemRepository.getCourseRevenueStatusBetween(start, end);
    }
}
