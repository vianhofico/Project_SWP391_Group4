package com.javaweb.repository;

import com.javaweb.entity.Report;
import com.javaweb.repository.custom.ReportRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long>, ReportRepositoryCustom {

}
