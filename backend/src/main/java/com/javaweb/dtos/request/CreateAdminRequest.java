package com.javaweb.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CreateAdminRequest(
        @NotBlank(message = "email cannot empty")
        @Email(message = "Incorrect email format")
        String email,
        @NotBlank(message = "password cannot empty")
        String password) {
}
