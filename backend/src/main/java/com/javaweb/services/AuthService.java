package com.javaweb.services;

import com.javaweb.dtos.events.VerifyEmailRequest;
import com.javaweb.dtos.request.LoginRequest;
import com.javaweb.dtos.request.RegisterRequest;
import com.javaweb.dtos.request.ResetPasswordRequest;
import com.javaweb.dtos.response.LoginResponse;

public interface AuthService {

    LoginResponse loginForLearner(LoginRequest loginRequest);

    LoginResponse loginForAdmin(LoginRequest loginRequest);

    void register(RegisterRequest registerRequest);

    void sendEmailResetPassword(ResetPasswordRequest resetPasswordRequest);

    void sendEmailVerification(VerifyEmailRequest verifyEmailRequest);

    void verifyEmail(String token);

    void resendVerificationEmail(String email);
}
