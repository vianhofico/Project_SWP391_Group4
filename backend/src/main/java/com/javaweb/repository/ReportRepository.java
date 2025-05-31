package com.javaweb.repository;

import com.javaweb.entity.Report;
import com.javaweb.repository.custom.ReportRepositoryCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long>, ReportRepositoryCustom {

    public Page<Report> findByReporterUserId(Long userId, Pageable pageable);

    public Page<Report> findByTargetUserId(Long userId, Pageable pageable);
}
