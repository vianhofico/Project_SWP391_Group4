package com.javaweb.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LoginRequest(
        @Email(message = "Invalid email")
        @NotBlank(message = "Invalid email")
        String email,
        @NotBlank(message = "Invalid password")
        String password
) {
}
