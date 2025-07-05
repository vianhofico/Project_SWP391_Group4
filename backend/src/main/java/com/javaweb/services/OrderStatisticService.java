package com.javaweb.services;

import com.javaweb.dtos.response.admin.CourseRevenueDTO;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderStatisticService {
    List<CourseRevenueDTO> getAllStats();
    List<CourseRevenueDTO> getStatsBetween(LocalDateTime start, LocalDateTime end);

}
