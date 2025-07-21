package dev.likeech.java.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import dev.likeech.java.model.dto.UploadFileDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface CloudinaryService {

    UploadFileDTO uploadFile(MultipartFile file) throws IOException;

    List<UploadFileDTO> uploadFiles(List<MultipartFile> files) throws IOException;

    void uploadFileKafka(MultipartFile multipartFile, Long postId) throws JsonProcessingException, IOException;

    void uploadFilesKafka(List<MultipartFile> multipartFiles, Long postId) throws JsonProcessingException, IOException;

    void deleteFile(String publicFileId) throws JsonProcessingException, IOException;
}
