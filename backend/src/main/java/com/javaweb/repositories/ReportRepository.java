package com.javaweb.repositories;

import com.javaweb.entities.Report;
import com.javaweb.enums.ReportType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReportRepository extends JpaRepository<Report, Long> {

    Page<Report> findByReporterUserId(Long userId, Pageable pageable);

    Page<Report> findByTargetUserId(Long userId, Pageable pageable);

    @Query("SELECT r FROM Report r WHERE (:reporterName IS NULL OR r.reporter.fullName LIKE %:reporterName%) " +
            "AND (:targetName IS NULL OR r.target.fullName LIKE %:targetName%) " +
            "AND r.status = :status AND (r.reportType = :reportType OR :reportType IS NULL)")
    Page<Report> getAllReports(@Param("reporterName") String reporterName, @Param("targetName") String targetName, @Param("status") String status, @Param("reportType") ReportType reportType, Pageable pageable);

}
