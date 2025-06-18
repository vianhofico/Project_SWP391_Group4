package dev.likeech.java.service;


import dev.likeech.java.model.dto.CourseDTO;

public interface GcsService {
    String generateUploadUrl(String filename, String contentType, String folder);
    String generateViewUrl(String filename, String folder);
}
