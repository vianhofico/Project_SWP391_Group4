package com.javaweb.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.javaweb.dtos.request.ResetPasswordRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class EmailKafkaConsumer {

    private final ObjectMapper objectMapper;
    private final AuthService authService;

    @Async
    @KafkaListener(topics = "email", groupId = "email-group")
    public void resetPassword(String json)
            throws JsonProcessingException {
        ResetPasswordRequest resetPasswordRequest =
                objectMapper.readValue(json, ResetPasswordRequest.class);
        authService.resetPassword(resetPasswordRequest);
    }
}

