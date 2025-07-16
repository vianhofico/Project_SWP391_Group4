package com.javaweb.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegisterRequest(
        @Email(message = "Wrong email format")
        @NotBlank(message = "Wrong email format")
        String email,
        @NotBlank(message = "password cannot empty")
        String password,
        @NotBlank(message = "confirm password cannot empty")
        String confirmPassword
) {
}
