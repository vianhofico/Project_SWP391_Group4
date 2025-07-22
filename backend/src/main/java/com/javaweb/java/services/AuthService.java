package com.javaweb.java.services;

import com.javaweb.java.dtos.response.LoginResponse;
import com.javaweb.java.dtos.events.VerifyEmailRequest;
import com.javaweb.java.dtos.request.LoginRequest;
import com.javaweb.java.dtos.request.RegisterRequest;
import com.javaweb.java.dtos.request.ResetPasswordRequest;

public interface AuthService {

    LoginResponse login(LoginRequest loginRequest);

    void register(RegisterRequest registerRequest);

    void sendEmailResetPassword(ResetPasswordRequest resetPasswordRequest);

    void sendEmailVerification(VerifyEmailRequest verifyEmailRequest);

    void verifyEmail(String token);

    void resendVerificationEmail(String email);
}
