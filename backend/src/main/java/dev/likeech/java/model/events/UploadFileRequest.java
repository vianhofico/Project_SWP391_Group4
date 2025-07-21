package dev.likeech.java.model.events;

public record UploadFileRequest(
        String fileName,
        String contentType,
        byte[] fileContent,
        Long postId
) {


}
