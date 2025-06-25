package dev.likeech.java.service;


import dev.likeech.java.entity.LessonMainVideoEntity;

public interface LessonMainVideoService {
    LessonMainVideoEntity createMainVideo(String url);
    void cleanupOldDeletedMainVideos();
}
