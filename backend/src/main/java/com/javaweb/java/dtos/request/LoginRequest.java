package com.javaweb.java.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @Email(message = "Invalid email")
        @NotBlank(message = "Invalid email")
        String email,
        @NotBlank(message = "Invalid password")
        String password
) {
}
