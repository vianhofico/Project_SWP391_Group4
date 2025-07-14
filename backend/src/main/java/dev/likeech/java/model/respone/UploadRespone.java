package dev.likeech.java.model.respone;

public record UploadRespone(
        String objectName,
        String signedUrl
        ) {
}
