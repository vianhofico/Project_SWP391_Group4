package com.javaweb.services;

import com.javaweb.dtos.response.admin.ReportDTO;
import com.javaweb.dtos.request.ReportRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReportService {

    Page<ReportDTO> getAllReports(ReportRequest reportRequest, Pageable pageable);

    void setStatus(Long reportId, String status);

    Page<ReportDTO> getAllReportsMade(Long userId, Pageable pageable);

    Page<ReportDTO> getAllReportsReceived(Long userId, Pageable pageable);

}
