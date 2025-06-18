package dev.likeech.java.repository.impl;


import com.google.cloud.storage.*;
import dev.likeech.java.repository.GcsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
public class GcsRepositoryImpl implements GcsRepository {
    private final Storage storage;
    private static final String BUCKET_NAME = "mr-met";


    public String generateViewSignedUrl(String objectName, String folder) {
        String objectPath = folder + "/" + objectName;

        BlobInfo blobInfo = BlobInfo.newBuilder(BUCKET_NAME, objectPath).build();

        URL signedUrl = storage.signUrl(
                blobInfo,
                15, TimeUnit.MINUTES,
                Storage.SignUrlOption.httpMethod(HttpMethod.GET),
                Storage.SignUrlOption.withV4Signature()
        );

        return signedUrl.toString();
    }
    public String generateUploadSignedUrl(String objectName, String contentType, String folder) {
        String objectPath = folder + "/" + objectName;

        BlobInfo blobInfo = BlobInfo.newBuilder(BUCKET_NAME, objectPath)
                .setContentType(contentType)
                .build();

        URL signedUrl = storage.signUrl(
                blobInfo,
                15, TimeUnit.MINUTES,
                Storage.SignUrlOption.httpMethod(HttpMethod.PUT),
                Storage.SignUrlOption.withV4Signature(),
                Storage.SignUrlOption.withContentType()
        );

        return signedUrl.toString();
    }
    public String generateDeleteSignedUrl(String fileUrl) {
        String objectName = fileUrl.replace("https://storage.googleapis.com/" + BUCKET_NAME + "/", "");

        BlobInfo blobInfo = BlobInfo.newBuilder(BUCKET_NAME, objectName).build();

        URL signedUrl = storage.signUrl(
                blobInfo,
                15, TimeUnit.MINUTES,
                Storage.SignUrlOption.httpMethod(HttpMethod.DELETE),
                Storage.SignUrlOption.withV4Signature()
        );

        return signedUrl.toString();
    }
    public void deleteViaSignedUrl(String fileUrl) {
        String signedUrl = generateDeleteSignedUrl(fileUrl);
        try {
            HttpURLConnection connection = (HttpURLConnection) new URL(signedUrl).openConnection();
            connection.setRequestMethod("DELETE");
            int responseCode = connection.getResponseCode();
            if (responseCode != HttpURLConnection.HTTP_NO_CONTENT && responseCode != HttpURLConnection.HTTP_OK) {
                throw new IOException("Failed to delete file via signed URL. HTTP code: " + responseCode);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file via signed URL", e);
        }
    }




}
