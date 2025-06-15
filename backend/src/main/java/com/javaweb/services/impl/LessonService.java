package com.javaweb.services.impl;


import com.javaweb.dtos.LessonDTO;
import com.javaweb.entities.Chapter;
import com.javaweb.entities.Course;
import com.javaweb.entities.Lesson;
import com.javaweb.exceptions.ResourceNotFoundException;
import com.javaweb.repositories.ChapterRepository;
import com.javaweb.repositories.CourseRepository;
import com.javaweb.repositories.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class LessonService {
    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ChapterRepository chapterRepository;

    public List<Lesson> getLessonsByChapter(Integer chapterId) {
        return lessonRepository.findByChapter_ChapterIdOrderByLessonOrderAsc(chapterId);
    }

    public Lesson getLessonById(Integer id) {
        return lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + id));
    }

    public Lesson createLesson(LessonDTO lessonDTO) {
        Lesson lesson = new Lesson();
        mapLessonDTOToEntity(lessonDTO, lesson);
        return lessonRepository.save(lesson);
    }

    public Lesson updateLesson(Integer id, LessonDTO lessonDTO) {
        Lesson lesson = getLessonById(id);
        mapLessonDTOToEntity(lessonDTO, lesson);
        return lessonRepository.save(lesson);
    }

    public void deleteLesson(Integer id) {
        Lesson lesson = getLessonById(id);
        lessonRepository.delete(lesson);
    }

    private void mapLessonDTOToEntity(LessonDTO dto, Lesson entity) {
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setLessonId(dto.getOrder());
        entity.setVideoUrl(dto.getVideoUrl());
        entity.setDuration(dto.getDuration());
        entity.setPublished(dto.getIsPublished());

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + dto.getCourseId()));
        entity.setCourse(course);

        Chapter chapter = chapterRepository.findById(dto.getChapterId())
                .orElseThrow(() -> new ResourceNotFoundException("Chapter not found with id: " + dto.getChapterId()));
        entity.setChapter(chapter);
    }
}