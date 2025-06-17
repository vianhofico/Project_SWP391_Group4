package com.javaweb.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LoginRequest(
        @NotNull(message = "Invalid email")
        @Email(message = "Invalid email")
        @NotBlank(message = "Invalid email")
        String email,
        @NotNull(message = "Invalid password")
        @NotBlank(message = "Invalid password")
        String password
) {
}
