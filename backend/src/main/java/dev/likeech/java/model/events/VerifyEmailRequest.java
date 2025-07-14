package dev.likeech.java.model.events;

public record VerifyEmailRequest(
        String email,
        String token
) {

}
