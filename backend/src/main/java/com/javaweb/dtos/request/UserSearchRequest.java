package com.javaweb.dtos.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserSearchRequest {

    private String fullName;
    @NotNull(message = "role cannot null")
    @Pattern(regexp = "ADMIN|LEARNER", flags = Pattern.Flag.CASE_INSENSITIVE, message = "role must ADMIN or LEARNER")
    private String role;
    @Pattern(regexp = "ACTIVE|INACTIVE|", flags = Pattern.Flag.CASE_INSENSITIVE, message = "status must 'ACTIVE' or 'INACTIVE' or NONE")
    private String status;
    @Null(message = "isActive phải là null")
    private Boolean isActive;
}
