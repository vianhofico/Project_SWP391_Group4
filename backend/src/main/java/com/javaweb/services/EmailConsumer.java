package com.javaweb.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.javaweb.dtos.events.EmailEvent;
import com.javaweb.dtos.events.VerifyEmailRequest;
import com.javaweb.dtos.request.CreateAdminRequest;
import com.javaweb.dtos.request.ResetPasswordRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
//import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class EmailConsumer {

    private final ObjectMapper objectMapper;
    private final AuthService authService;
    private final MailService mailService;

    //    @KafkaListener(topics = "email", groupId = "email-group")
    public void sendEmail(String json)
            throws JsonProcessingException {
        EmailEvent event = objectMapper.readValue(json, EmailEvent.class);
        String type = event.type();
        // Do data là Object nên cần xử lý thủ công
        JsonNode dataNode = objectMapper.valueToTree(event.data());

        switch (type) {
            case "VERIFY_EMAIL" -> {
                VerifyEmailRequest req = objectMapper.treeToValue(dataNode, VerifyEmailRequest.class);
                authService.sendEmailVerification(req); // Gửi email xác thực
            }
            case "RESET_PASSWORD" -> {
                ResetPasswordRequest req = objectMapper.treeToValue(dataNode, ResetPasswordRequest.class);
                authService.sendEmailResetPassword(req); // Gửi email quên mật khẩu
            }
            case "ADD_ADMIN" -> {
                CreateAdminRequest req = objectMapper.treeToValue(dataNode, CreateAdminRequest.class);
                mailService.sendEmail(req.email(), "Your admin account", "Your password is: " + req.password());
            }
            default -> log.warn("Unknown email type: {}", type);
        }
    }

    //    @KafkaListener(topics = "email.DLT", groupId = "email-dlt-group")
    public void handleEmailDLT(String json) {
        log.warn("Get message from topic DLT (email.DLT): {}", json);
        try {
            EmailEvent event = objectMapper.readValue(json, EmailEvent.class);
            String type = event.type();
            JsonNode dataNode = objectMapper.valueToTree(event.data());

            switch (type) {
                case "RESET_PASSWORD" -> {
                    ResetPasswordRequest req = objectMapper.treeToValue(dataNode, ResetPasswordRequest.class);
                    log.error("Send email RESET_PASSWORD failed for user: {}", req.to());
                }
                case "VERIFY_EMAIL" -> {
                    VerifyEmailRequest req = objectMapper.treeToValue(dataNode, VerifyEmailRequest.class);
                    log.error("Send email VERIFY_EMAIL failed for user: {}", req.email());
                }
                default -> log.warn("DLT: Unknown email type: {}", type);
            }

        } catch (Exception e) {
            log.error("Can't parse message from email.DLT: {}", json, e);
        }
    }


}

