package com.javaweb.controller.admin;

import com.javaweb.dtos.request.SignedUrlRequest;
import com.javaweb.dtos.response.UploadRespone;
import com.javaweb.repositories.GcsRepository;
import com.javaweb.services.GcsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/file")
public class AdminFileController {
    private final GcsService gcsService;
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasAnyRole('ADMIN', 'LEARNER')")
    @PostMapping("/signed-url/view")
    public ResponseEntity<Map<String, String>> generateViewSignedUrl(@Valid @RequestBody SignedUrlRequest request) {
        String signedUrl = gcsService.generateViewUrl(
                request.objectName(),
                request.folder()
        );
        return ResponseEntity.ok(Map.of("signedUrl", signedUrl));
    }
    @PostMapping("/public/signed-url/view")
    public ResponseEntity<Map<String, String>> publicViewUrl(@Valid @RequestBody SignedUrlRequest request) {
        String signedUrl = gcsService.generateViewUrl(
                request.objectName(),
                request.folder()
        );
        return ResponseEntity.ok(Map.of("signedUrl", signedUrl));
    }

}
