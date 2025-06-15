package com.javaweb.services.impl;


import com.javaweb.dtos.ChapterDTO;
import com.javaweb.entities.Chapter;
import com.javaweb.entities.Course;
import com.javaweb.exceptions.ResourceNotFoundException;
import com.javaweb.repositories.ChapterRepository;
import com.javaweb.repositories.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ChapterService {
    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private CourseRepository courseRepository;

    public List<Chapter> getChaptersByCourse(Integer courseId) {
        return chapterRepository.findByCourse_CourseIdOrderByChapterOrderAsc(courseId);
    }

    public Chapter getChapterById(Integer id) {
        return chapterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter not found with id: " + id));
    }

    public Chapter createChapter(ChapterDTO chapterDTO) {
        Chapter chapter = new Chapter();
        mapChapterDTOToEntity(chapterDTO, chapter);
        return chapterRepository.save(chapter);
    }

    public Chapter updateChapter(Integer id, ChapterDTO chapterDTO) {
        Chapter chapter = getChapterById(id);
        mapChapterDTOToEntity(chapterDTO, chapter);
        return chapterRepository.save(chapter);
    }

    public void deleteChapter(Integer id) {
        Chapter chapter = getChapterById(id);
        chapterRepository.delete(chapter);
    }

    private void mapChapterDTOToEntity(ChapterDTO dto, Chapter entity) {
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setChapterOrder(dto.getOrder());
        entity.setPublished(dto.getIsPublished());

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + dto.getCourseId()));
        entity.setCourse(course);
    }
}
