package com.javaweb.controller.client;

import com.javaweb.entity.dto.CourseDTO;
import com.javaweb.service.CourseDTOService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@Controller
public class HomePageController {
    private final CourseDTOService courseDTOService;

    public HomePageController(CourseDTOService courseDTOService) {
        this.courseDTOService = courseDTOService;
    }

    @GetMapping("/login")
    public String getLoginPage(Model model){
        return "client/auth/login";
    }


    @GetMapping("")
    public String homepage(Model model) {
        List<CourseDTO> courseDTOs = courseDTOService.getAllCourses();
        model.addAttribute("courses", courseDTOs);
        return "client/homepage/show";
    }
}
