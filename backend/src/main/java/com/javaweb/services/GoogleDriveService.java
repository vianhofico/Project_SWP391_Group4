package com.javaweb.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.javaweb.dtos.response.UploadFileDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface GoogleDriveService {

    UploadFileDTO uploadFile(MultipartFile file);

    List<UploadFileDTO> uploadMultipleFiles(List<MultipartFile> files);

    void uploadFileKafka(MultipartFile multipartFile, Long postId) throws IOException, JsonProcessingException;

    void uploadFilesKafka(List<MultipartFile> multipartFiles, Long postId) throws IOException, JsonProcessingException;

}
