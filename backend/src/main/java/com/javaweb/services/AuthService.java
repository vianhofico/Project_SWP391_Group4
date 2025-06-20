package com.javaweb.services;

import com.javaweb.dtos.request.LoginRequest;
import com.javaweb.dtos.request.RegisterRequest;
import com.javaweb.dtos.request.ResetPasswordRequest;
import com.javaweb.dtos.response.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest loginRequest);

    void register(RegisterRequest registerRequest);

    void resetPassword(ResetPasswordRequest resetPasswordRequest);
}
