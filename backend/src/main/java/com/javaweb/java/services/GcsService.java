package com.javaweb.java.services;


public interface GcsService {
    String generateUploadUrl(String filename, String contentType, String folder);
    String generateViewUrl(String filename, String folder);
}
