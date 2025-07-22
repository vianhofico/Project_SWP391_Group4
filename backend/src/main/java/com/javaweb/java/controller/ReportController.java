package com.javaweb.java.controller;


import com.javaweb.java.dtos.response.ReportDTO;
import com.javaweb.java.dtos.request.CreateReportRequest;
import com.javaweb.java.dtos.request.SearchReportRequest;
import com.javaweb.java.services.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public Page<ReportDTO> getAllReports(@ModelAttribute @Valid SearchReportRequest searchReportRequest, Pageable pageable) {
        return reportService.getAllReports(searchReportRequest, pageable);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'LEARNER')")
    @PutMapping("/{reportId}")
    public ResponseEntity<Void> setStatus(@PathVariable("reportId") Long reportId, @RequestBody Map<String, String> status) {
        reportService.setStatus(reportId, status.get("status"));
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('LEARNER')")
    @PostMapping()
    public ResponseEntity<Void> createReport(@RequestBody @Valid CreateReportRequest createReportRequest) {
        reportService.createReport(createReportRequest);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'LEARNER')")
    @GetMapping("/{reportId}")
    public ResponseEntity<ReportDTO> getReportById(@PathVariable("reportId") Long reportId) {
        return ResponseEntity.ok(reportService.getReport(reportId));
    }


}
