package dev.likeech.java.model.request;

import jakarta.validation.constraints.NotBlank;

public record ResendEmailRequest(
        @NotBlank(message = "Need email to resend verification")
        String email
) {

}
