package com.javaweb.controller;

import com.javaweb.dtos.response.admin.ReportDTO;
import com.javaweb.dtos.request.ReportRequest;
import com.javaweb.services.ReportService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Validated
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    public Page<ReportDTO> getAllReports(@ModelAttribute @Valid ReportRequest reportRequest, Pageable pageable) {
        return reportService.getAllReports(reportRequest, pageable);
    }

    @PutMapping("/{reportId}")
    public ResponseEntity<Void> setStatus(@PathVariable("reportId") @Positive(message = "reportId must positive") Long reportId, @RequestBody Map<String, String> status) {
        reportService.setStatus(reportId, status.get("status"));
        return ResponseEntity.noContent().build();
    }

}
