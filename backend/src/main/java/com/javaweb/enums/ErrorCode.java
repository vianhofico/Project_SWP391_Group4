package com.javaweb.enums;

public enum ErrorCode {

    // 1. AUTHENTICATION
    UNAUTHORIZED(1001, "Chưa đăng nhập hoặc thiếu token"),
    TOKEN_INVALID(1002, "Token không hợp lệ"),
    SESSION_EXPIRED(1003, "Phiên đăng nhập đã hết hạn"),
    INVALID_CREDENTIALS(1004, "Email hoặc mật khẩu không đúng"),

    // 2. AUTHORIZATION
    FORBIDDEN(1101, "Không có quyền truy cập"),
    ROLE_NOT_ALLOWED(1102, "Vai trò người dùng không phù hợp"),
    ACTION_NOT_PERMITTED(1103, "Không được phép thực hiện hành động này"),

    // 3. VALIDATION
    MISSING_REQUIRED_FIELD(1201, "Thiếu trường bắt buộc"),
    INVALID_FORMAT(1202, "Dữ liệu sai định dạng"),
    DUPLICATE_DATA(1203, "Dữ liệu đã tồn tại"),
    VALUE_OUT_OF_RANGE(1204, "Giá trị vượt quá giới hạn"),
    CONSTRAINT_VIOLATION(1205, "Vi phạm ràng buộc dữ liệu"),

    // 4. RESOURCE
    RESOURCE_NOT_FOUND(1301, "Không tìm thấy tài nguyên"),
    RESOURCE_ALREADY_EXISTS(1302, "Tài nguyên đã tồn tại"),
    RESOURCE_IN_USE(1303, "Tài nguyên đang được sử dụng, không thể xóa"),

    // 5. SYSTEM
    DATABASE_ERROR(1401, "Lỗi cơ sở dữ liệu"),
    EXTERNAL_SERVICE_ERROR(1402, "Lỗi kết nối đến dịch vụ ngoài"),
    UNKNOWN_ERROR(1403, "Lỗi không xác định"),

    // 6. BUSINESS LOGIC
    INSUFFICIENT_BALANCE(1501, "Không đủ số dư để thanh toán"),
    COURSE_EXPIRED(1502, "Khóa học đã hết hạn"),
    COURSE_ALREADY_ENROLLED(1503, "Người dùng đã đăng ký khóa học"),
    EXAM_ALREADY_SUBMITTED(1504, "Bài kiểm tra đã được nộp");

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
