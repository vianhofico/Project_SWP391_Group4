package com.javaweb.services;

import com.javaweb.dtos.request.CreateReportRequest;
import com.javaweb.dtos.request.SearchReportRequest;
import com.javaweb.dtos.response.ReportDTO;
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
