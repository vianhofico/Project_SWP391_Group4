package com.javaweb.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserSearchRequest {

    private String fullName;

    private String role;

    private String status;

    private Boolean isActive;
}
