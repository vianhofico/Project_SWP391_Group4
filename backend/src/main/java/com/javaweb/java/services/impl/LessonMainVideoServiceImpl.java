package com.javaweb.java.services.impl;

import com.javaweb.java.repositories.GcsRepository;
import com.javaweb.java.repositories.LessonMainVideoRepository;
import com.javaweb.java.entities.LessonMainVideo;
import com.javaweb.java.enums.ResourceType;
import com.javaweb.java.services.LessonMainVideoService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonMainVideoServiceImpl implements LessonMainVideoService {
    private final LessonMainVideoRepository lessonMainVideoRepository;
    private final GcsRepository gcsRepository;
    private static final Logger log = LoggerFactory.getLogger(LessonMainVideoServiceImpl.class);
    @Override
    @Transactional
    public LessonMainVideo createMainVideo(String url) {
        return lessonMainVideoRepository.save(
                LessonMainVideo.builder().url(url)
                        .createdAt(LocalDateTime.now())
                        .isDelete(false)
                        .type(ResourceType.video)
                .build()
        );
    }
//    @Scheduled(cron = "0 * * * * *")
    @Override
    @Scheduled(cron = "0 0 3 * * *")
    public void cleanupOldDeletedMainVideos() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(7);
        List<LessonMainVideo> lessonMainVideoEntities = lessonMainVideoRepository.findByIsDeleteTrueAndDeletedAtBefore(cutoff);
        for (LessonMainVideo lessonMainVideo : lessonMainVideoEntities) {
            try {
                gcsRepository.deleteViaSignedUrl(lessonMainVideo.getUrl());
                lessonMainVideoRepository.delete(lessonMainVideo);
            } catch (Exception e) {
                log.error("Failed to delete main video: {}", lessonMainVideo.getUrl(), e);
            }
        }
    }
}
