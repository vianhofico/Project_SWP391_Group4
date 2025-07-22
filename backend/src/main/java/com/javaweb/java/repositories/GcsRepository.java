package com.javaweb.java.repositories;

public interface GcsRepository {
    String generateViewSignedUrl(String objectName, String folder);
    String generateUploadSignedUrl(String objectName, String contentType, String folder);
    String generateDeleteSignedUrl(String fileUrl);
    void deleteViaSignedUrl(String fileUrl);
}
