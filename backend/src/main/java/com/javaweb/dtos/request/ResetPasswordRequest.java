package com.javaweb.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ResetPasswordRequest(
        @NotBlank(message = "Email cannot empty")
        @Email(message = "Wrong email format")
        String to
) {
}
