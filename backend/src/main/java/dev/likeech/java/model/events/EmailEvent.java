package dev.likeech.java.model.events;

public record EmailEvent(String type, Object data) {
    public EmailEvent of(String type, Object data) {
        return new EmailEvent(type, data);
    }
}
