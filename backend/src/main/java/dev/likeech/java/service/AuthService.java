package dev.likeech.java.service;

import dev.likeech.java.model.respone.LoginResponse;
import dev.likeech.java.model.events.VerifyEmailRequest;
import dev.likeech.java.model.request.LoginRequest;
import dev.likeech.java.model.request.RegisterRequest;
import dev.likeech.java.model.request.ResetPasswordRequest;

public interface AuthService {

    LoginResponse login(LoginRequest loginRequest);

    void register(RegisterRequest registerRequest);

    void sendEmailResetPassword(ResetPasswordRequest resetPasswordRequest);

    void sendEmailVerification(VerifyEmailRequest verifyEmailRequest);

    void verifyEmail(String token);

    void resendVerificationEmail(String email);
}
