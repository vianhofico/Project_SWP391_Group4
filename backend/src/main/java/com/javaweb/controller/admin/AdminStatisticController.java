package com.javaweb.controller.admin;


import com.javaweb.dtos.response.admin.CourseRevenueDTO;
import com.javaweb.services.OrderStatisticService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/statistics")
@CrossOrigin("*")
public class AdminStatisticController {

    @Autowired
    private OrderStatisticService statisticService;

    // API: GET /api/admin/statistics/course-revenue
    @GetMapping("/course-revenue")
    public List<CourseRevenueDTO> getAllRevenueStats() {
        return statisticService.getAllStats();
    }

    // API: GET /api/admin/statistics/course-revenue/filter?start=2024-01-01T00:00:00&end=2025-01-01T00:00:00
    @GetMapping("/course-revenue/filter")
    public List<CourseRevenueDTO> getStatsByTime(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        return statisticService.getStatsBetween(start, end);
    }
}
