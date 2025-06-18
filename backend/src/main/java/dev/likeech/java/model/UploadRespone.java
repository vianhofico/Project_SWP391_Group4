package dev.likeech.java.model;

public record UploadRespone(
        String objectName,
        String signedUrl
        ) {
}
