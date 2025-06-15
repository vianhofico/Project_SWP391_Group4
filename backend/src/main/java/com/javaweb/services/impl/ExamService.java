package com.javaweb.services.impl;


import com.javaweb.dtos.ExamDTO;
import com.javaweb.entities.Chapter;
import com.javaweb.entities.Course;
import com.javaweb.entities.Exam;
import com.javaweb.entities.Lesson;
import com.javaweb.exceptions.ResourceNotFoundException;
import com.javaweb.repositories.ChapterRepository;
import com.javaweb.repositories.CourseRepository;
import com.javaweb.repositories.ExamRepository;
import com.javaweb.repositories.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ExamService {
    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private LessonRepository lessonRepository;

    public List<Exam> getExamsByLesson(Integer lessonId) {
        return examRepository.findByLesson_LessonIdAndIsDeletedFalse(lessonId);
    }

    public Exam getExamById(Integer id) {
        return examRepository.findByExamIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + id));
    }

    public Exam createExam(ExamDTO examDTO) {
        Exam exam = new Exam();
        mapExamDTOToEntity(examDTO, exam);
        return examRepository.save(exam);
    }

    public Exam updateExam(Integer id, ExamDTO examDTO) {
        Exam exam = getExamById(id);
        mapExamDTOToEntity(examDTO, exam);
        return examRepository.save(exam);
    }

    public void deleteExam(Integer id) {
        Exam exam = getExamById(id);
        exam.setDeleted(true);
        examRepository.save(exam);
    }

    private void mapExamDTOToEntity(ExamDTO dto, Exam entity) {
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setTimeLimit(dto.getTimeLimit());
        entity.setMaxAttempts(dto.getMaxAttempts());
        entity.setPublished(dto.getIsPublished());

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + dto.getCourseId()));
        entity.setCourse(course);

        Chapter chapter = chapterRepository.findById(dto.getChapterId())
                .orElseThrow(() -> new ResourceNotFoundException("Chapter not found with id: " + dto.getChapterId()));
        entity.setChapter(chapter);

        Lesson lesson = lessonRepository.findById(dto.getLessonId())
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + dto.getLessonId()));
        entity.setLesson(lesson);
    }
}