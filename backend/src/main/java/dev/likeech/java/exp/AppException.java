package dev.likeech.java.exp;

public class AppException extends RuntimeException {
    public AppException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    private final ErrorCode errorCode;

    public ErrorCode getErrorCode() {
        return errorCode;
    }

}
