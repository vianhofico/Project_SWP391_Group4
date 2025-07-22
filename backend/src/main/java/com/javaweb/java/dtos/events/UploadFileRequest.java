package com.javaweb.java.dtos.events;

public record UploadFileRequest(
        String fileName,
        String contentType,
        byte[] fileContent,
        Long postId
) {


}
