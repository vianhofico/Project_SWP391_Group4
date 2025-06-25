package com.javaweb.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.javaweb.dtos.request.LoginRequest;
import com.javaweb.dtos.request.RegisterRequest;
import com.javaweb.dtos.request.ResetPasswordRequest;
import com.javaweb.dtos.response.LoginResponse;
import com.javaweb.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ObjectMapper objectMapper;


    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody @Valid RegisterRequest registerRequest) {
        authService.register(registerRequest);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> sendEmail(@RequestBody @Valid ResetPasswordRequest resetPasswordRequest)
            throws JsonProcessingException {
        String json = objectMapper.writeValueAsString(resetPasswordRequest);
        kafkaTemplate.send("email", json);
        return ResponseEntity.ok("Đã nhận yêu cầu gửi email");
    }

}
