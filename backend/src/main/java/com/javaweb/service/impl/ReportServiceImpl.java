package com.javaweb.service.impl;

import com.javaweb.converter.ReportDTOConverter;
import com.javaweb.dto.ReportDTO;
import com.javaweb.dto.request.ReportRequest;
import com.javaweb.entity.Report;
import com.javaweb.repository.ReportRepository;
import com.javaweb.service.ReportService;
import com.javaweb.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final ReportDTOConverter reportDTOConverter;
    private final UserService userService;

    @Transactional(readOnly = true)
    @Override
    public Page<ReportDTO> getAllReports(ReportRequest reportRequest, Pageable pageable) {
        Page<Report> pageReports = reportRepository.getAllReports(reportRequest, pageable);
        return pageReports.map(reportDTOConverter::toReportDTO);
    }

    @Transactional
    @Override
    public void setStatus(Long reportId, String status) {
        Report report = reportRepository.findById(reportId).orElse(null);
        if (report != null) {
            report.setStatus(status);
            reportRepository.save(report);
            userService.updateReportCount(report.getTarget().getUserId());
        }
    }

}
