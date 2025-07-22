package com.javaweb.java.services;

import com.javaweb.java.entities.Lesson;
import com.javaweb.java.entities.User;
import com.javaweb.java.dtos.response.LessonProgressDTO;

public interface LessonProgressService {
    LessonProgressDTO startLesson(User user, Lesson lesson);
    LessonProgressDTO completeLesson(User user, Lesson lesson);
}
