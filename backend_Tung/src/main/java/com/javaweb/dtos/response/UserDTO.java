package com.javaweb.dtos.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UserDTO {
    private Long userId;
    private String fullName;
    private String email;
    private LocalDate birthDate;
    private String password;
    private String role;
    private LocalDateTime createdAt;
    private Boolean isActive;
    private Integer reportCount;
    private String imageUrl;
}