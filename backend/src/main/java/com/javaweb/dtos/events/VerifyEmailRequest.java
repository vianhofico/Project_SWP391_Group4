package com.javaweb.dtos.events;

public record VerifyEmailRequest(
        String email,
        String token
) {

}
