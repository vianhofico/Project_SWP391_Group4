package com.javaweb.enums;

public enum PostStatus {
    ACTIVE("ACTIVE"),
    DELETED("DELETED");

    private final String value;

    PostStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return value;
    }
}
