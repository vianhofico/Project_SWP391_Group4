package dev.likeech.java.api.admin;

import dev.likeech.java.model.request.SignedUrlRequest;
import dev.likeech.java.model.UploadRespone;
import dev.likeech.java.repository.GcsRepository;
import dev.likeech.java.service.GcsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/file")
public class FileAPI {
    private final GcsService gcsService;
    private final GcsRepository gcsRepository;
    @PostMapping("/signed-url/upload")
    public ResponseEntity<UploadRespone> generateUploadSignedUrl(@Valid @RequestBody SignedUrlRequest request) {
        String signedUrl = gcsService.generateUploadUrl(
                request.objectName(),
                request.type(),
                request.folder()
        );
        UploadRespone uploadRespone = new UploadRespone(request.objectName(), signedUrl);
        return ResponseEntity.ok(uploadRespone);
    }
    @PostMapping("/signed-url/view")
    public ResponseEntity<Map<String, String>> generateViewSignedUrl(@Valid @RequestBody SignedUrlRequest request) {
        String signedUrl = gcsService.generateViewUrl(
                request.objectName(),
                request.folder()
        );
        return ResponseEntity.ok(Map.of("signedUrl", signedUrl));
    }

}
