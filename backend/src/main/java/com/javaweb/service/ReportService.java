package com.javaweb.service;

import com.javaweb.dto.ReportDTO;
import com.javaweb.dto.request.ReportRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReportService {

    public Page<ReportDTO> getAllReports(ReportRequest reportRequest, Pageable pageable);

    public void setStatus(Long reportId, String status);


}
