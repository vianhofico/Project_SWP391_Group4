package com.javaweb.dtos.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record ReportRequest(
        String reporterName,
        String targetName,
        @NotNull(message = "report status cannot null")
        @Pattern(regexp = "PENDING|APPROVED|REJECTED", flags = Pattern.Flag.CASE_INSENSITIVE, message = "report status must be PENDING or APPROVED or REJECTED")
        String status,
        @Pattern(regexp = "ASC|DESC", flags = Pattern.Flag.CASE_INSENSITIVE, message = "sortOrder must be ASC or DESC")
        String sortOrder
) {

}
