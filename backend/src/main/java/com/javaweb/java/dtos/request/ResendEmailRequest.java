package com.javaweb.java.dtos.request;

import jakarta.validation.constraints.NotBlank;

public record ResendEmailRequest(
        @NotBlank(message = "Need email to resend verification")
        String email
) {

}
