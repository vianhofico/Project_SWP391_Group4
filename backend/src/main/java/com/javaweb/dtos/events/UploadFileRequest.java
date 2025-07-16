package com.javaweb.dtos.events;

public record UploadFileRequest(
        String fileName,
        String contentType,
        byte[] fileContent,
        Long postId
) {


}
