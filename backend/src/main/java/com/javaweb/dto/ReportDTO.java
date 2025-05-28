package com.javaweb.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@ToString(exclude = {"reporter", "target"})
public class ReportDTO {

    private Long reportId;
    private String content;
    private String status;
    private LocalDateTime createdAt;
    private UserDTO reporter;
    private UserDTO target;

}
