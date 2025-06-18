package dev.likeech.java.repository;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface GcsRepository {
    String generateViewSignedUrl(String objectName, String folder);
    String generateUploadSignedUrl(String objectName, String contentType, String folder);
    String generateDeleteSignedUrl(String fileUrl);
    void deleteViaSignedUrl(String fileUrl);
}
