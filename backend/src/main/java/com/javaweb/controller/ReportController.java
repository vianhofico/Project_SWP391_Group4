package com.javaweb.controller;

import com.javaweb.dtos.response.ReportDTO;
import com.javaweb.dtos.request.ReportSearchRequest;
import com.javaweb.services.ReportService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Validated
public class ReportController {

    private final ReportService reportService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public Page<ReportDTO> getAllReports(@ModelAttribute @Valid ReportSearchRequest reportSearchRequest, Pageable pageable) {
        return reportService.getAllReports(reportSearchRequest, pageable);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'ROLE')")
    @PutMapping("/{reportId}")
    public ResponseEntity<Void> setStatus(@PathVariable("reportId") @Positive(message = "reportId must positive") Long reportId, @RequestBody Map<String, String> status) {
        System.out.println("status: " + status);
        reportService.setStatus(reportId, status.get("status"));
        return ResponseEntity.noContent().build();
    }

}
