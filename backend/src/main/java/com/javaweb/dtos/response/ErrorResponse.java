package com.javaweb.dtos.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@RequiredArgsConstructor

public class ErrorResponse {
    private int code;
    private List<String> message;
    private String timestamp;
    private String path;

    public ErrorResponse(int code, List<String> message, String path) {
        this.code = code;
        this.message = message;
        this.path = path;
        this.timestamp = Instant.now().toString();
    }
}

