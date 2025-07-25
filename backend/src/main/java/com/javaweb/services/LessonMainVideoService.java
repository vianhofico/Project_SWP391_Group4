package com.javaweb.services;


import com.javaweb.entities.LessonMainVideo;

public interface LessonMainVideoService {
    LessonMainVideo createMainVideo(String url);
    void cleanupOldDeletedMainVideos();
}
