package com.javaweb.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.javaweb.dtos.events.UploadFileRequest;
import com.javaweb.dtos.response.UploadFileDTO;
import com.javaweb.services.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
//import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;
    private final ObjectMapper objectMapper;

    public UploadFileDTO uploadFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("resource_type", "auto")
        );

        UploadFileDTO dto = new UploadFileDTO();
        dto.setFileUrl(uploadResult.get("secure_url").toString());
        dto.setFileType(file.getContentType());
        dto.setFileName(file.getOriginalFilename());
        dto.setPublicFileId(uploadResult.get("public_id").toString());

        return dto;
    }

    @Override
    public List<UploadFileDTO> uploadFiles(List<MultipartFile> files) throws IOException {
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
//        kafkaTemplate.send("file", objectMapper.writeValueAsString(uploadFileRequest));
    }

    @Override
    public void uploadFilesKafka(List<MultipartFile> multipartFiles, Long postId) throws JsonProcessingException, IOException {
        if (multipartFiles == null) return;
        for (MultipartFile multipartFile : multipartFiles) {
            uploadFileKafka(multipartFile, postId);
        }
    }

    @Override
    public void deleteFile(String publicFileId) throws JsonProcessingException, IOException {
        try {
            Map result = cloudinary.uploader().destroy(publicFileId, ObjectUtils.emptyMap());
            String status = (String) result.get("result");
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file: " + publicFileId, e);
        }
    }

}
