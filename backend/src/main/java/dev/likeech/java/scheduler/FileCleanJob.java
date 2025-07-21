package dev.likeech.java.scheduler;


import dev.likeech.java.entity.PostFile;
import dev.likeech.java.repository.PostFileRepository;
import dev.likeech.java.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class FileCleanJob {

    private final PostFileRepository postFileRepository;
    private final CloudinaryService cloudinaryService;

    @Transactional
    @Scheduled(cron = "0 0 2 * * ?")
    public void deleteOrphanFiles() {
        List<PostFile> orphanFiles = postFileRepository.findAllByPostIsNull();
        for (PostFile file : orphanFiles) {
            try {
                cloudinaryService.deleteFile(file.getPublicFileId());
                postFileRepository.delete(file);
            } catch (Exception e) {
                log.error("Failed to delete file with ID {} from Cloudinary", file.getPublicFileId(), e);
            }
        }
    }

}
