package com.javaweb.java.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.javaweb.java.dtos.response.LoginResponse;
import com.javaweb.java.dtos.events.EmailEvent;
import com.javaweb.java.dtos.request.LoginRequest;
import com.javaweb.java.dtos.request.RegisterRequest;
import com.javaweb.java.dtos.request.ResendEmailRequest;
import com.javaweb.java.dtos.request.ResetPasswordRequest;
import com.javaweb.java.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final KafkaTemplate<String, String> kafkaTemplate;
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

    @GetMapping("/verify")
    public ResponseEntity<Void> verifyEmail(@RequestParam("token") String token){
        authService.verifyEmail(token);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<Void> resendVerification(@RequestBody @Valid ResendEmailRequest request) {
        authService.resendVerificationEmail(request.email());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> sendEmail(@RequestBody @Valid ResetPasswordRequest resetPasswordRequest)
            throws JsonProcessingException {
        EmailEvent event = new EmailEvent(
                "RESET_PASSWORD",
                resetPasswordRequest
        );
        String json = objectMapper.writeValueAsString(event);
        kafkaTemplate.send("email", json);
        return ResponseEntity.ok("Đã nhận yêu cầu gửi email");
    }
}
