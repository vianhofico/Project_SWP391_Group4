package com.javaweb.dtos.request;

public record ChangePasswordRequest(
        String email,
        String oldPassword,
        String newPassword,
        String confirmPassword
) {
}
