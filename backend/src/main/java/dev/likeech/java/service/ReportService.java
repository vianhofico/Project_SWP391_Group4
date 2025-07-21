package dev.likeech.java.service;

import dev.likeech.java.model.dto.ReportDTO;
import dev.likeech.java.model.request.CreateReportRequest;
import dev.likeech.java.model.request.SearchReportRequest;
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
