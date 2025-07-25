package com.javaweb.dtos.response;

public record UploadRespone(
        String objectName,
        String signedUrl
        ) {
}
