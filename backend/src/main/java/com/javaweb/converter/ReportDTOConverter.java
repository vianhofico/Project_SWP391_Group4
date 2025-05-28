package com.javaweb.converter;

import com.javaweb.dto.ReportDTO;
import com.javaweb.entity.Report;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReportDTOConverter {

    private final ModelMapper modelMapper;

    public ReportDTO toReportDTO(Report report) {
        ReportDTO reportDTO = new ReportDTO();
        reportDTO = modelMapper.map(report, ReportDTO.class);
        return reportDTO;
    }

}
