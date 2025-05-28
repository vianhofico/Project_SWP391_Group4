package com.javaweb.repository.custom;

import com.javaweb.dto.request.ReportRequest;
import com.javaweb.entity.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReportRepositoryCustom {

    public Page<Report> getAllReports(ReportRequest reportRequest, Pageable pageable);


}
