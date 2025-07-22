package com.javaweb.java.services;


import com.javaweb.java.dtos.response.CourseRevenueDTO;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderStatisticService {
    List<CourseRevenueDTO> getAllStats();
    List<CourseRevenueDTO> getStatsBetween(LocalDateTime start, LocalDateTime end);

}
