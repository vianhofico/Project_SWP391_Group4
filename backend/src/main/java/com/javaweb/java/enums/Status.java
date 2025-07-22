package com.javaweb.java.enums;

public enum Status {
    ACTIVE("ACTIVE"),
    DELETED("DELETED");

    private final String value;

    Status(String value) {
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
