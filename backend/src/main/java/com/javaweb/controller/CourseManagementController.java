package com.javaweb.controller;


import com.javaweb.dtos.ExamDTO;
import com.javaweb.dtos.QuestionDTO;
import com.javaweb.entities.*;
import com.javaweb.services.impl.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @Autowired
    private ExcelService excelService;

    @GetMapping
    public String showCoursesDashboard(@RequestParam(required = false) String keyword, Model model) {
        List<Course> courses;
        if (keyword != null && !keyword.isEmpty()) {
            courses = courseService.searchCourses(keyword);
        } else {
            courses = courseService.getAllCourses();
        }

        model.addAttribute("courses", courses);
        model.addAttribute("allCourses", courseService.getAllCourses()); // Thêm dòng này
        model.addAttribute("selectedCourseId", courses.isEmpty() ? null : courses.get(0).getCourseId());
        return "course-dashboard";
    }

    @GetMapping("/{courseId}/chapters")
    public String showChapters(@PathVariable Integer courseId, Model model) {
        Course course = courseService.getCourseById(courseId);
        List<Chapter> chapters = chapterService.getChaptersByCourse(courseId);
        List<Course> courses = courseService.getAllCourses();

        Map<Integer, List<Lesson>> lessonMap = new HashMap<>();
        Map<Integer, Integer> lessonCountMap = new HashMap<>();

        for (Chapter ch : chapters) {
            List<Lesson> lessons = lessonService.getLessonsByChapter(ch.getChapterId());
            lessonMap.put(ch.getChapterId(), lessons);
            lessonCountMap.put(ch.getChapterId(), lessons.size());
        }

        model.addAttribute("courses", courses);
        model.addAttribute("allCourses", courseService.getAllCourses());
        model.addAttribute("course", course);
        model.addAttribute("chapters", chapters);
        model.addAttribute("lessonMap", lessonMap);
        model.addAttribute("lessonCountMap", lessonCountMap);
        model.addAttribute("selectedCourseId", courseId);

        return "course-dashboard";
    }

    @GetMapping("/{courseId}/chapters/{chapterId}/lessons")
    public String showLessons(@PathVariable Integer courseId,
                              @PathVariable Integer chapterId,
                              Model model) {
        Course course = courseService.getCourseById(courseId);
        Chapter chapter = chapterService.getChapterById(chapterId);
        List<Chapter> chapters = chapterService.getChaptersByCourse(courseId);
        List<Lesson> lessons = lessonService.getLessonsByChapter(chapterId);
        List<Course> courses = courseService.getAllCourses();

        model.addAttribute("courses", courses);
        model.addAttribute("allCourses", courseService.getAllCourses());
        model.addAttribute("course", course);
        model.addAttribute("chapter", chapter);
        model.addAttribute("chapters", chapters);
        model.addAttribute("lessons", lessons);
        model.addAttribute("selectedCourseId", courseId);
        model.addAttribute("selectedChapterId", chapterId);

        return "course-dashboard";
    }


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

    @GetMapping("{courseId}/chapters/{chapterId}/lessons/{lessonId}/exam/create")
    public String showCreateExamForm(@PathVariable Integer courseId,
                                     @PathVariable Integer chapterId,
                                     @PathVariable Integer lessonId,
                                     Model model) {
        model.addAttribute("examDTO", new ExamDTO());
        return "admin/create-exam";
    }

    @PostMapping("/{courseId}/chapters/{chapterId}/lessons/{lessonId}/exam/create")
    public String createExam(@PathVariable Integer courseId,
                             @PathVariable Integer chapterId,
                             @PathVariable Integer lessonId,
                             @ModelAttribute ExamDTO examDTO,
                             Model model) {
        examDTO.setCourseId(courseId);
        examDTO.setChapterId(chapterId);
        examDTO.setLessonId(lessonId);

        examService.createExam(examDTO);

        return "redirect:/admin/courses/" + courseId + "/chapters/" + chapterId + "/lessons/" + lessonId + "/exam";
    }

    @PostMapping("/{courseId}/chapters/{chapterId}/lessons/{lessonId}/exam/{examId}/update")
    public String updateExam(@PathVariable Integer courseId,
                             @PathVariable Integer chapterId,
                             @PathVariable Integer lessonId,
                             @PathVariable Integer examId,
                             @ModelAttribute ExamDTO examDTO,
                             Model model) {
        examDTO.setCourseId(courseId);
        examDTO.setChapterId(chapterId);
        examDTO.setLessonId(lessonId);

        examService.updateExam(examId, examDTO);

        return "redirect:/admin/courses/" + courseId + "/chapters/" + chapterId + "/lessons/" + lessonId + "/exam";
    }


    @GetMapping("/{courseId}/chapters/{chapterId}/lessons/{lessonId}/exam/{examId}/questions/new")
    public String showCreateQuestionForm(@PathVariable Integer courseId,
                                         @PathVariable Integer chapterId,
                                         @PathVariable Integer lessonId,
                                         @PathVariable Integer examId,
                                         Model model) {
        Course course = courseService.getCourseById(courseId);
        Chapter chapter = chapterService.getChapterById(chapterId);
        Lesson lesson = lessonService.getLessonById(lessonId);
        Exam exam = examService.getExamById(examId);

        model.addAttribute("course", course);
        model.addAttribute("chapter", chapter);
        model.addAttribute("lesson", lesson);
        model.addAttribute("exam", exam);
        model.addAttribute("questionDTO", new QuestionDTO());
        return "create-question";
    }

    @GetMapping("/{courseId}/chapters/{chapterId}/lessons/{lessonId}/exam/{examId}/questions/{questionId}/edit")
    public String showEditQuestionForm(@PathVariable Integer courseId,
                                       @PathVariable Integer chapterId,
                                       @PathVariable Integer lessonId,
                                       @PathVariable Integer examId,
                                       @PathVariable Integer questionId,
                                       Model model) {
        Course course = courseService.getCourseById(courseId);
        Chapter chapter = chapterService.getChapterById(chapterId);
        Lesson lesson = lessonService.getLessonById(lessonId);
        Exam exam = examService.getExamById(examId);
        Question question = questionService.getQuestionById(questionId);

        model.addAttribute("course", course);
        model.addAttribute("chapter", chapter);
        model.addAttribute("lesson", lesson);
        model.addAttribute("exam", exam);
        model.addAttribute("question", question);
        return "update-question";
    }

    @GetMapping("/{courseId}/chapters/{chapterId}/lessons/{lessonId}/exam/{examId}/questions")
    public String showQuestionBank(@PathVariable Integer courseId,
                                   @PathVariable Integer chapterId,
                                   @PathVariable Integer lessonId,
                                   @PathVariable Integer examId,
                                   @RequestParam(required = false) Boolean showDeleted,
                                   Model model) {
        Course course = courseService.getCourseById(courseId);
        Chapter chapter = chapterService.getChapterById(chapterId);
        Lesson lesson = lessonService.getLessonById(lessonId);
        Exam exam = examService.getExamById(examId);

        List<Question> questions = questionService.getQ(examId);

        model.addAttribute("course", course);
        model.addAttribute("chapter", chapter);
        model.addAttribute("lesson", lesson);
        model.addAttribute("exam", exam);
        model.addAttribute("questions", questions);
        model.addAttribute("showDeleted", showDeleted);
        return "question-list";
    }

    @GetMapping ("/{courseId}/chapters/{chapterId}/lessons/{lessonId}/exam/{examId}/questions/{questionId}/delete")
    public String deleteQuestion(@PathVariable Integer courseId,
                                 @PathVariable Integer chapterId,
                                 @PathVariable Integer lessonId,
                                 @PathVariable Integer examId,
                                 @PathVariable Integer questionId) {

        questionService.deleteQuestion(questionId);
        return "redirect:/admin/courses/" + courseId + "/chapters/" + chapterId +
                "/lessons/" + lessonId + "/exam/" + examId + "/questions";
    }

    @GetMapping("/{courseId}/chapters/{chapterId}/lessons/{lessonId}/exam/{examId}/questions/{questionId}/restore")
    public String restoreQuestion(@PathVariable Integer courseId,
                                  @PathVariable Integer chapterId,
                                  @PathVariable Integer lessonId,
                                  @PathVariable Integer examId,
                                  @PathVariable Integer questionId) {
        questionService.restoreQuestion(questionId);
        return "redirect:/admin/courses/" + courseId + "/chapters/" + chapterId +
                "/lessons/" + lessonId + "/exam/" + examId + "/questions?showDeleted=true";
    }



    @PostMapping("/{courseId}/chapters/{chapterId}/lessons/{lessonId}/exam/{examId}/questions/new")
    public String addQuestion(@PathVariable Integer courseId,
                              @PathVariable Integer chapterId,
                              @PathVariable Integer lessonId,
                              @PathVariable Integer examId,
                              @ModelAttribute QuestionDTO questionDTO) {
        questionDTO.setExamId(examId);
        questionService.createQuestion(questionDTO);
        return "redirect:/admin/courses/" + courseId + "/chapters/" + chapterId + "/lessons/" + lessonId + "/exam/" + examId + "/questions";
    }

    @PostMapping("/{courseId}/chapters/{chapterId}/lessons/{lessonId}/exam/{examId}/questions/{questionId}/edit")
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

    @PostMapping("/{courseId}/chapters/{chapterId}/lessons/{lessonId}/exam/{examId}/questions/import")
    public String importQuestions(@PathVariable Integer courseId,
                                  @PathVariable Integer chapterId,
                                  @PathVariable Integer lessonId,
                                  @PathVariable Integer examId,
                                  @RequestParam("excelFile") MultipartFile file,
                                  RedirectAttributes redirectAttributes) {

        List<String> errors = excelService.importQuestionsFromExcel(file, examId);

        if (!errors.isEmpty()) {
            redirectAttributes.addFlashAttribute("importErrors", errors);
        } else {
            redirectAttributes.addFlashAttribute("successMessage", "Import thành công!");
        }

        return "redirect:/admin/courses/" + courseId + "/chapters/" + chapterId +
                "/lessons/" + lessonId + "/exam/" + examId + "/questions";
    }
}