package com.javaweb.services.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dtos.response.ReportDTO;
import com.javaweb.dtos.request.SearchReportRequest;
import com.javaweb.entities.Report;
import com.javaweb.exceptions.AccessDeniedException;
import com.javaweb.exceptions.ResourceNotFoundException;
import com.javaweb.repositories.ReportRepository;
import com.javaweb.security.utils.SecurityUtils;
import com.javaweb.services.ReportService;
import com.javaweb.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final DTOConverter dtoConverter;
    private final UserService userService;

    @Transactional(readOnly = true)
    @Override
    public Page<ReportDTO> getAllReports(SearchReportRequest searchReportRequest, Pageable pageable) {
        String status = searchReportRequest.status();
        String reporterName = searchReportRequest.reporterName();
        String targetName = searchReportRequest.targetName();
        String sortOrder = searchReportRequest.sortOrder();

        if (sortOrder == null) {
            sortOrder = "DESC";
        }
        Sort.Direction direction = Sort.Direction.fromString(sortOrder);
        pageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(direction, "createdAt")
        );
        Page<Report> pageReports = reportRepository.getAllReports(reporterName, targetName, status, pageable);
        return pageReports.map(dtoConverter::toReportDTO);
    }

    @Transactional
    @Override
    public void setStatus(Long reportId, String status) {
        Report report = reportRepository.findById(reportId).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy report với id: " + reportId));

        String currentUserEmail = SecurityUtils.getCurrentUserEmail();

        if (currentUserEmail == null || !currentUserEmail.equals(report.getReporter().getEmail()) && SecurityUtils.hasRole("ROLE_LEARNER") || !SecurityUtils.hasRole("ROLE_ADMIN")) {
            throw new AccessDeniedException("No access");
        }

        report.setStatus(status);
        reportRepository.save(report);
        userService.updateReportCount(report.getTarget().getUserId());
    }

    @Override
    public Page<ReportDTO> getAllReportsMade(Long userId, Pageable pageable) {
        Page<Report> pageReports = reportRepository.findByReporterUserId(userId, pageable);
        return pageReports.map(dtoConverter::toReportDTO);
    }

    @Override
    public Page<ReportDTO> getAllReportsReceived(Long userId, Pageable pageable) {
        Page<Report> pageReports = reportRepository.findByTargetUserId(userId, pageable);
        return pageReports.map(dtoConverter::toReportDTO);
    }

}
