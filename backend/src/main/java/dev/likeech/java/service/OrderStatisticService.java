package dev.likeech.java.service;


import dev.likeech.java.model.dto.CourseRevenueDTO;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderStatisticService {
    List<CourseRevenueDTO> getAllStats();
    List<CourseRevenueDTO> getStatsBetween(LocalDateTime start, LocalDateTime end);

}
