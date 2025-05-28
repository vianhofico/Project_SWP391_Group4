package com.javaweb.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserDTO {

    private Long userId;
    private String fullName;
    private String email;
    private LocalDate birthDate;
    private String password;
    private String role;
    private LocalDateTime createdAt;
    private String status;
    private Integer reportCount;
    private String imageUrl;

}
