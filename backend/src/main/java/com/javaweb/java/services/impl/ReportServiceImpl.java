package com.javaweb.java.services.impl;


import com.javaweb.java.entities.Comment;
import com.javaweb.java.entities.Post;
import com.javaweb.java.entities.Report;
import com.javaweb.java.entities.User;
import com.javaweb.java.enums.ReportType;
import com.javaweb.java.exceptions.AccessDeniedException;
import com.javaweb.java.exceptions.BusinessException;
import com.javaweb.java.exceptions.ResourceNotFoundException;
import com.javaweb.java.converter.DTOConverter;
import com.javaweb.java.dtos.response.ReportDTO;
import com.javaweb.java.dtos.request.CreateReportRequest;
import com.javaweb.java.dtos.request.SearchReportRequest;
import com.javaweb.java.repositories.CommentRepository;
import com.javaweb.java.repositories.PostRepository;
import com.javaweb.java.repositories.ReportRepository;
import com.javaweb.java.repositories.UserRepository;
import com.javaweb.java.security.utils.SecurityUtils;
import com.javaweb.java.services.ReportService;
import com.javaweb.java.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final DTOConverter dtoConverter;
    private final UserService userService;

    @Override
    public Page<ReportDTO> getAllReports(SearchReportRequest searchReportRequest, Pageable pageable) {
        String status = searchReportRequest.status();
        String reporterName = searchReportRequest.reporterName();
        String targetName = searchReportRequest.targetName();
        String sortOrder = searchReportRequest.sortOrder();
        String reportTypeRaw = searchReportRequest.reportType();
        ReportType reportType = null;
        if (reportTypeRaw != null && !reportTypeRaw.isBlank()) {
            reportType = ReportType.valueOf(reportTypeRaw.toUpperCase());
        }

        if (sortOrder == null) {
            sortOrder = "DESC";
        }

        Sort.Direction direction = Sort.Direction.fromString(sortOrder);
        pageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(direction, "createdAt")
        );
        Page<Report> pageReports = reportRepository.getAllReports(reporterName, targetName, status, reportType, pageable);
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

    @Transactional
    @Override
    public void createReport(CreateReportRequest createReportRequest) {
        String currentUserEmail = SecurityUtils.getCurrentUserEmail();
        User currentUser = userRepository.findByEmail(currentUserEmail).orElseThrow(
                () -> new ResourceNotFoundException("User not found"));

        String reportTypeRaw = createReportRequest.reportType();
        ReportType reportType = ReportType.valueOf(reportTypeRaw);
        String content = (reportType == ReportType.OTHER) ? createReportRequest.content() : null;
        Long commentId = createReportRequest.commentId();
        Long postId = createReportRequest.postId();
        if ((commentId == null && postId == null) || (postId != null && commentId != null)) {
            throw new BusinessException("Report comment or post comment is null");
        }

        Post post = new Post();
        Comment comment = new Comment();
        User targetUser = new User();

        if (postId != null) {
            post = postRepository.findById(postId)
                    .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
            targetUser = post.getUser();
            comment = null;
        } else {
            comment = commentRepository.findById(commentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
            targetUser = comment.getUser();
            post = null;
        }

        Report report = Report
                .builder()
                .reportType(reportType)
                .reporter(currentUser)
                .target(targetUser)
                .createdAt(LocalDateTime.now())
                .content(content)
                .comment(comment)
                .post(post)
                .status("PENDING")
                .build();

        reportRepository.save(report);
    }

    @Override
    public ReportDTO getReport(Long reportId) {
        Report thisReport = reportRepository.findById(reportId).orElseThrow(
                () -> new ResourceNotFoundException("Report not found"));
        return dtoConverter.toReportDTO(thisReport);
    }

}
