package com.javaweb.controller;

import com.javaweb.dto.ReportDTO;
import com.javaweb.dto.request.ReportRequest;
import com.javaweb.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    public Page<ReportDTO> getAllReports(@ModelAttribute ReportRequest reportRequest, Pageable pageable) {
        return reportService.getAllReports(reportRequest, pageable);
    }

    @PutMapping("/{reportId}")
    public void setStatus(@PathVariable("reportId") Long reportId, @RequestBody Map<String, String> status) {
        reportService.setStatus(reportId, status.get("status"));
    }

}
