package com.javaweb.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public record CreateAdminRequest(
        @NotNull(message = "email cannot null")
        @Email(message = "Incorrect email format")
        String email,
        @NotNull(message = "password cannot null")
        String password) {
}
