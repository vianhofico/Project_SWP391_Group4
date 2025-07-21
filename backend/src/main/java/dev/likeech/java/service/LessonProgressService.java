package dev.likeech.java.service;

import dev.likeech.java.entity.Lesson;
import dev.likeech.java.entity.User;
import dev.likeech.java.model.dto.LessonProgressDTO;

public interface LessonProgressService {
    LessonProgressDTO startLesson(User user, Lesson lesson);
    LessonProgressDTO completeLesson(User user, Lesson lesson);
}
