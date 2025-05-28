package com.javaweb.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReportRequest {

    private String reporterName;

    private String targetName;

    private String status;

    private String sortOrder;

}
