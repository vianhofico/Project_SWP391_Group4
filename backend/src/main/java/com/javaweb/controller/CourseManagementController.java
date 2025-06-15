package com.javaweb.controller;


import com.javaweb.dtos.ExamDTO;
import com.javaweb.dtos.QuestionDTO;
import com.javaweb.entities.*;
import com.javaweb.services.impl.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/admin/courses")
public class CourseManagementController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private ChapterService chapterService;

    @Autowired
    private LessonService lessonService;

    @Autowired
    private ExamService examService;

    @Autowired
    private QuestionService questionService;

    // Dashboard - Show all courses
    @GetMapping
    public String showCoursesDashboard(@RequestParam(required = false) String keyword, Model model) {
        List<Course> courses;
        if (keyword != null && !keyword.isEmpty()) {
            courses = courseService.searchCourses(keyword);
        } else {
            courses = courseService.getAllCourses();
        }

        model.addAttribute("courses", courses);
        model.addAttribute("selectedCourseId", courses.isEmpty() ? null : courses.get(0).getCourseId());
        return "/course-dashboard";
    }

    // Show chapters for a specific course
    @GetMapping("/{courseId}/chapters")
    public String showChapters(@PathVariable Integer courseId, Model model) {
        Course course = courseService.getCourseById(courseId);
        List<Chapter> chapters = chapterService.getChaptersByCourse(courseId);
        List<Course> courses = courseService.getAllCourses();

        model.addAttribute("courses", courses);

        model.addAttribute("course", course);
        model.addAttribute("chapters", chapters);
        model.addAttribute("selectedCourseId", courseId);
        return "/course-dashboard";
    }

    @GetMapping("/{courseId}/chapters/{chapterId}/lessons")
    public String showLessons(@PathVariable Integer courseId,
                              @PathVariable Integer chapterId,
                              Model model) {
        Course course = courseService.getCourseById(courseId);
        List<Chapter> chapters = chapterService.getChaptersByCourse(courseId);
        List<Lesson> lessons = lessonService.getLessonsByChapter(chapterId);
        List<Course> courses = courseService.getAllCourses();

        model.addAttribute("courses", courses);
        model.addAttribute("course", course);
        model.addAttribute("chapters", chapters);
        model.addAttribute("lessons", lessons);
        model.addAttribute("selectedCourseId", courseId);
        model.addAttribute("selectedChapterId", chapterId); // ⚠️ RẤT QUAN TRỌNG
        return "course-dashboard";
    }


//    // Show lessons for a specific chapter
//    @GetMapping("/{courseId}/chapters/{chapterId}/lessons")
//    public String showLessons(@PathVariable Integer courseId,
//                              @PathVariable Integer chapterId,
//                              Model model) {
//        Course course = courseService.getCourseById(courseId);
//        List<Chapter> chapters = chapterService.getChaptersByCourse(courseId);
//        List<Course> courses = courseService.getAllCourses();
//        List<Lesson> lessons = lessonService.getLessonsByChapter(chapterId);
//        model.addAttribute("courses", courses);
//        model.addAttribute("chapters", chapters);
//        model.addAttribute("course", course);
//        model.addAttribute("lessons", lessons);
//        model.addAttribute("selectedCourseId", courseId);
//        return "course-dashboard";
//
////        return "admin/course-dashboard";
//    }

    // Show exam for a lesson (or create new)
    @GetMapping("/{courseId}/chapters/{chapterId}/lessons/{lessonId}/exam")
    public String manageExam(@PathVariable Integer courseId,
                             @PathVariable Integer chapterId,
                             @PathVariable Integer lessonId,
                             Model model) {
        Course course = courseService.getCourseById(courseId);
        Chapter chapter = chapterService.getChapterById(chapterId);
        Lesson lesson = lessonService.getLessonById(lessonId);
        List<Exam> exams = examService.getExamsByLesson(lessonId);

        Exam exam = exams.isEmpty() ? new Exam() : exams.get(0);

        model.addAttribute("course", course);
        model.addAttribute("chapter", chapter);
        model.addAttribute("lesson", lesson);
        model.addAttribute("exam", exam);
        model.addAttribute("examDTO", new ExamDTO());
        model.addAttribute("hasExam", !exams.isEmpty());
        model.addAttribute("selectedCourseId", courseId);
        return "exam-management";
    }

    // Save or update exam
    @PostMapping("/{courseId}/chapters/{chapterId}/lessons/{lessonId}/exam")
    public String saveExam(@PathVariable Integer courseId,
                           @PathVariable Integer chapterId,
                           @PathVariable Integer lessonId,
                           @ModelAttribute ExamDTO examDTO,
                           Model model) {
        examDTO.setCourseId(courseId);
        examDTO.setChapterId(chapterId);
        examDTO.setLessonId(lessonId);

        List<Exam> existingExams = examService.getExamsByLesson(lessonId);
        if (existingExams.isEmpty()) {
            examService.createExam(examDTO);
        } else {
            examService.updateExam(existingExams.get(0).getExamId(), examDTO);
        }

        return "redirect:/admin/courses/" + courseId + "/chapters/" + chapterId + "/lessons/" + lessonId + "/exam";
    }

    // Show question bank for an exam
    @GetMapping("/{courseId}/chapters/{chapterId}/lessons/{lessonId}/exam/{examId}/questions")
    public String showQuestionBank(@PathVariable Integer courseId,
                                   @PathVariable Integer chapterId,
                                   @PathVariable Integer lessonId,
                                   @PathVariable Integer examId,
                                   Model model) {
        Course course = courseService.getCourseById(courseId);
        Chapter chapter = chapterService.getChapterById(chapterId);
        Lesson lesson = lessonService.getLessonById(lessonId);
        Exam exam = examService.getExamById(examId);
        List<Question> questions = questionService.getQuestionsByExam(examId);

        model.addAttribute("course", course);
        model.addAttribute("chapter", chapter);
        model.addAttribute("lesson", lesson);
        model.addAttribute("exam", exam);
        model.addAttribute("questions", questions);
        model.addAttribute("questionDTO", new QuestionDTO());
        model.addAttribute("selectedCourseId", courseId);
        return "admin/question-bank";
    }

    // Add new question
    @PostMapping("/{courseId}/chapters/{chapterId}/lessons/{lessonId}/exam/{examId}/questions")
    public String addQuestion(@PathVariable Integer courseId,
                              @PathVariable Integer chapterId,
                              @PathVariable Integer lessonId,
                              @PathVariable Integer examId,
                              @ModelAttribute QuestionDTO questionDTO) {
        questionDTO.setExamId(examId);
        questionService.createQuestion(questionDTO);
        return "redirect:/admin/courses/" + courseId + "/chapters/" + chapterId + "/lessons/" + lessonId + "/exam/" + examId + "/questions";
    }

    // Update question
    @PostMapping("/{courseId}/chapters/{chapterId}/lessons/{lessonId}/exam/{examId}/questions/{questionId}")
    public String updateQuestion(@PathVariable Integer courseId,
                                 @PathVariable Integer chapterId,
                                 @PathVariable Integer lessonId,
                                 @PathVariable Integer examId,
                                 @PathVariable Integer questionId,
                                 @ModelAttribute QuestionDTO questionDTO) {
        questionDTO.setExamId(examId);
        questionService.updateQuestion(questionId, questionDTO);
        return "redirect:/admin/courses/" + courseId + "/chapters/" + chapterId + "/lessons/" + lessonId + "/exam/" + examId + "/questions";
    }

    // Delete question
    @PostMapping("/{courseId}/chapters/{chapterId}/lessons/{lessonId}/exam/{examId}/questions/{questionId}/delete")
    public String deleteQuestion(@PathVariable Integer courseId,
                                 @PathVariable Integer chapterId,
                                 @PathVariable Integer lessonId,
                                 @PathVariable Integer examId,
                                 @PathVariable Integer questionId) {
        questionService.deleteQuestion(questionId);
        return "redirect:/admin/courses/" + courseId + "/chapters/" + chapterId + "/lessons/" + lessonId + "/exam/" + examId + "/questions";
    }
}