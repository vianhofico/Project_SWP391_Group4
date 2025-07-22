package com.javaweb.java.services;


import com.javaweb.java.entities.LessonMainVideo;

public interface LessonMainVideoService {
    LessonMainVideo createMainVideo(String url);
    void cleanupOldDeletedMainVideos();
}
