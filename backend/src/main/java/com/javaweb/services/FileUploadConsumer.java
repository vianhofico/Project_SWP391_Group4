package com.javaweb.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.javaweb.dtos.events.UploadFileRequest;
import com.javaweb.dtos.response.UploadFileDTO;
import com.javaweb.entities.Post;
import com.javaweb.entities.PostFile;
import com.javaweb.repositories.PostFileRepository;
import com.javaweb.repositories.PostRepository;
import com.javaweb.utils.ByteArrayMultipartFile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileUploadConsumer {

    private final ObjectMapper objectMapper;
    private final PostRepository postRepository;
    private final GoogleDriveService googleDriveService;
    private final PostFileRepository postFileRepository;

    @KafkaListener(topics = "file", groupId = "file-upload-group")
    public void handleFileUpload(String message) {
        try {
            UploadFileRequest request = objectMapper.readValue(message, UploadFileRequest.class);
            Post post = postRepository.findById(request.postId()).orElseThrow(
                    () -> new RuntimeException("Post not found")
            );
            MultipartFile multipartFile = ByteArrayMultipartFile.builder()
                    .name("file")
                    .originalFilename(request.fileName())
                    .contentType(request.contentType())
                    .content(request.fileContent())
                    .build();

            UploadFileDTO fileDTO = googleDriveService.uploadFile(multipartFile);

            PostFile postFile = PostFile.builder()
                    .fileName(fileDTO.getFileName())
                    .fileType(fileDTO.getFileType())
                    .fileUrl(fileDTO.getFileUrl())
                    .post(post)
                    .build();

            postFileRepository.save(postFile);

        } catch (Exception e) {
            log.error("Lỗi khi xử lý message Kafka (upload file): {}", message, e);
        }

    }
}
