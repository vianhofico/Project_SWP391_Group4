package dev.likeech.java.service;


import dev.likeech.java.entity.LessonMainVideo;

public interface LessonMainVideoService {
    LessonMainVideo createMainVideo(String url);
    void cleanupOldDeletedMainVideos();
}
