package dev.likeech.java.exp;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    TOPIC_NOT_FOUND(2001, "Topic not existed", HttpStatus.NOT_FOUND),
    COURSE_NOT_FOUND(2002, "Course not existed", HttpStatus.NOT_FOUND),
    CHAPTER_NOT_FOUND(2005, "Chapter not existed", HttpStatus.NOT_FOUND),
    LESSON_NOT_FOUND(2006, "Lesson not existed", HttpStatus.NOT_FOUND),
    FAILED_TO_UPLOAD_FILE(2003, "Failed to upload file to GCS", HttpStatus.BAD_REQUEST),
    INVALID_REQUEST(2004, "Chapter does not belong to this course.", HttpStatus.NOT_FOUND),
    MAIN_VIDEO_ALREADY_USED(2004, "The main video file is already used by another lesson", HttpStatus.BAD_REQUEST),
    ;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}