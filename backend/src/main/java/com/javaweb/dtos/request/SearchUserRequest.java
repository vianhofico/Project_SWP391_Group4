package com.javaweb.dtos.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record SearchUserRequest(
        String fullName,
        @NotNull(message = "role cannot null")
        @Pattern(regexp = "ADMIN|LEARNER", flags = Pattern.Flag.CASE_INSENSITIVE, message = "role must ADMIN or LEARNER")
        String role,
        @Pattern(regexp = "ACTIVE|INACTIVE|", flags = Pattern.Flag.CASE_INSENSITIVE, message = "status must 'ACTIVE' or 'INACTIVE' or NONE")
        String status,

        @Pattern(regexp = "fullName|birthDate|reportCount|", flags = Pattern.Flag.CASE_INSENSITIVE, message = "Sort field must be fullName OR birthDate OR reportCount OR NONE")
        String sortField,
        @Pattern(regexp = "ASC|DESC|", flags = Pattern.Flag.CASE_INSENSITIVE, message = "Sort order must be ASC or DESC or NONE")
        String sortOrder) {

}
