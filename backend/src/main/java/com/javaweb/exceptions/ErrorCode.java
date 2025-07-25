package com.javaweb.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    // === HỆ THỐNG CHUNG ===
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Invalid key", HttpStatus.BAD_REQUEST),

    // === USER ===
    USER_EXISTED(1002, "User already exists", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),

    // === KHÓA HỌC ===
    TOPIC_NOT_FOUND(2001, "Topic not existed", HttpStatus.NOT_FOUND),
    COURSE_NOT_FOUND(2002, "Course not existed", HttpStatus.NOT_FOUND),
    FAILED_TO_UPLOAD_FILE(2003, "Failed to upload file to GCS", HttpStatus.BAD_REQUEST),
    INVALID_REQUEST(2004, "Invalid request", HttpStatus.BAD_REQUEST),
    CHAPTER_NOT_FOUND(2005, "Chapter not existed", HttpStatus.NOT_FOUND),
    LESSON_NOT_FOUND(2006, "Lesson not existed", HttpStatus.NOT_FOUND),
    MAIN_VIDEO_ALREADY_USED(2009, "The main video file is already used by another lesson", HttpStatus.BAD_REQUEST),
    DUPLICATE_PROGRESS_RECORD(1111, "Duplicate progress record", HttpStatus.BAD_REQUEST),
    // === ENROLLMENT ===
    COURSE_HAS_ENROLLMENTS(3000, "Course has enrollments, cannot delete", HttpStatus.BAD_REQUEST),
    COURSE_NOT_ENROLLED(12345, "User has not registered for the course", HttpStatus.BAD_REQUEST),
    COURSE_NOT_COMPLETED(12346, "You must complete 100% of the course to be assessed.", HttpStatus.BAD_REQUEST),
    // === BÁO CÁO & VI PHẠM ===
    RESOURCE_NOT_FOUND(4001, "Resource not found", HttpStatus.NOT_FOUND),
    RESOURCE_ALREADY_EXISTS(4002, "Resource already exists", HttpStatus.CONFLICT),
    ACTION_NOT_PERMITTED(4003, "Action not permitted", HttpStatus.FORBIDDEN),

    // === VALIDATION ===
    CONSTRAINT_VIOLATION(5000, "Constraint violation", HttpStatus.BAD_REQUEST),
    INVALID_FORMAT(5001, "Invalid format", HttpStatus.BAD_REQUEST);

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}