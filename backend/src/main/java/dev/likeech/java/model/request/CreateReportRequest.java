package dev.likeech.java.model.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record CreateReportRequest(

        @NotNull(message = "Need report type")
        @Pattern(regexp = "SPAM|INAPPROPRIATE_LANGUAGE|HARASSMENT|MISINFORMATION|CHEATING|VIOLATES_GUIDELINES|OTHER", flags = Pattern.Flag.CASE_INSENSITIVE, message = "Invalid Report Type")
        String reportType,

        String content, //if reportType == OTHER

        Long commentId,

        Long postId
) {
}
