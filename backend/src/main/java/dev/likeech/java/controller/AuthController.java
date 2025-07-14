package dev.likeech.java.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import dev.likeech.java.model.respone.LoginResponse;
import dev.likeech.java.model.events.EmailEvent;
import dev.likeech.java.model.request.LoginRequest;
import dev.likeech.java.model.request.RegisterRequest;
import dev.likeech.java.model.request.ResendEmailRequest;
import dev.likeech.java.model.request.ResetPasswordRequest;
import dev.likeech.java.service.AuthService;
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
