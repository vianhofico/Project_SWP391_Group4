package dev.likeech.java.service.impl;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import dev.likeech.java.repository.GcsRepository;
import dev.likeech.java.service.GcsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class GcsServiceImpl implements GcsService {
    private final GcsRepository gcsRepository;
    public String generateUploadUrl(String filename, String contentType, String folder) {
        return gcsRepository.generateUploadSignedUrl(filename, contentType, folder);
    }

    public String generateViewUrl(String filename, String folder) {
        return gcsRepository.generateViewSignedUrl(filename, folder);
    }
    public void deleteFile(String fileUrl) {
        String bucket = "your-bucket-name";
        String objectName = fileUrl.replace("https://storage.googleapis.com/" + bucket + "/", "");
        Storage storage = StorageOptions.getDefaultInstance().getService();
        boolean deleted = storage.delete(bucket, objectName);

        if (!deleted) {
            throw new RuntimeException("Failed to delete from GCS: " + fileUrl);
        }
    }

}
