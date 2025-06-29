package com.javaweb.services.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.http.InputStreamContent;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.Permission;
import com.javaweb.dtos.events.UploadFileRequest;
import com.javaweb.dtos.response.UploadFileDTO;
import com.javaweb.services.GoogleDriveService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleDriveServiceImpl implements GoogleDriveService {

    private Drive driveService;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @PostConstruct
    public void init() throws Exception {
        InputStream credentialsStream = getClass()
                .getClassLoader()
                .getResourceAsStream("swp391-group4-project-401579e1eaee.json");

        if (credentialsStream == null) {
            throw new RuntimeException("File credentials.json not found in resources");
        }

        GoogleCredential credential = GoogleCredential.fromStream(credentialsStream)
                .createScoped(Collections.singleton("https://www.googleapis.com/auth/drive"));

        driveService = new Drive.Builder(
                credential.getTransport(),
                credential.getJsonFactory(),
                credential
        ).setApplicationName("Drive Upload").build();
    }

    @Override
    public UploadFileDTO uploadFile(MultipartFile multipartFile) {
        try {
            if (multipartFile == null) return null;
            File fileMetadata = new File();
            fileMetadata.setName(multipartFile.getOriginalFilename());

            InputStreamContent content = new InputStreamContent(
                    multipartFile.getContentType(),
                    multipartFile.getInputStream()
            );

            File uploaded = driveService.files()
                    .create(fileMetadata, content)
                    .setFields("id, webViewLink")
                    .execute();

            Permission permission = new Permission()
                    .setType("anyone")
                    .setRole("reader");
            driveService.permissions().create(uploaded.getId(), permission).execute();

            log.info("Upload thành công: {}", uploaded.getId());
            return UploadFileDTO.builder()
                    .fileUrl(uploaded.getWebViewLink())
                    .fileName(multipartFile.getOriginalFilename())
                    .fileType(multipartFile.getContentType())
                    .build();

        } catch (Exception e) {
            log.error("Upload thất bại", e);
            throw new RuntimeException("Upload failed", e);
        }
    }

    @Override
    public List<UploadFileDTO> uploadMultipleFiles(List<MultipartFile> files) {
        if (files == null) return null;
        List<UploadFileDTO> uploadFileDTOList = new ArrayList<>();
        for (MultipartFile file : files) {
            UploadFileDTO uploadFileDTO = uploadFile(file);
            uploadFileDTOList.add(uploadFileDTO);
        }
        return uploadFileDTOList;
    }

    @Override
    public void uploadFileKafka(MultipartFile multipartFile, Long postId) throws JsonProcessingException, IOException {
        if (multipartFile == null) return;
        UploadFileRequest uploadFileRequest =
                new UploadFileRequest(multipartFile.getOriginalFilename(),
                        multipartFile.getContentType(),
                        multipartFile.getBytes(),
                        postId);

        String json = objectMapper.writeValueAsString(uploadFileRequest);
        log.info("Sending to Kafka: {}", json);
        kafkaTemplate.send("file", objectMapper.writeValueAsString(uploadFileRequest));
    }

    @Override
    public void uploadFilesKafka(List<MultipartFile> multipartFiles, Long postId) throws JsonProcessingException, IOException {
        if (multipartFiles == null) return;
        for (MultipartFile multipartFile : multipartFiles) {
            uploadFileKafka(multipartFile, postId);
        }
    }

}
