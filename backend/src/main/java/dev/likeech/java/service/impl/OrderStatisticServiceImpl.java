package dev.likeech.java.service.impl;


import dev.likeech.java.model.dto.CourseRevenueDTO;
import dev.likeech.java.repository.OrderItemRepository;
import dev.likeech.java.service.OrderStatisticService;
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
