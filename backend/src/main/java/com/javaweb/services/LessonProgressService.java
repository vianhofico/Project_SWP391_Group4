package com.javaweb.services;

import com.javaweb.dtos.response.LessonProgressDTO;
import com.javaweb.entities.Lesson;
import com.javaweb.entities.User;

public interface LessonProgressService {
    LessonProgressDTO startLesson(User user, Lesson lesson);
    LessonProgressDTO completeLesson(User user, Lesson lesson);
}
