package com.javaweb.java.dtos.response;

public record UploadRespone(
        String objectName,
        String signedUrl
        ) {
}
