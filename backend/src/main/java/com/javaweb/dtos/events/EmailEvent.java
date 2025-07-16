package com.javaweb.dtos.events;

public record EmailEvent(String type, Object data) {
    public EmailEvent of(String type, Object data) {
        return new EmailEvent(type, data);
    }
}
