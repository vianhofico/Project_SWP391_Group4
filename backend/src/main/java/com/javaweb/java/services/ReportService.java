package com.javaweb.java.services;

import com.javaweb.java.dtos.response.ReportDTO;
import com.javaweb.java.dtos.request.CreateReportRequest;
import com.javaweb.java.dtos.request.SearchReportRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReportService {

    Page<ReportDTO> getAllReports(SearchReportRequest searchReportRequest, Pageable pageable);

    void setStatus(Long reportId, String status);

    Page<ReportDTO> getAllReportsMade(Long userId, Pageable pageable);

    Page<ReportDTO> getAllReportsReceived(Long userId, Pageable pageable);

    void createReport(CreateReportRequest createReportRequest);

    ReportDTO getReport(Long reportId);
}
