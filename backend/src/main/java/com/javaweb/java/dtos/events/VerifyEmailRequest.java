package com.javaweb.java.dtos.events;

public record VerifyEmailRequest(
        String email,
        String token
) {

}
