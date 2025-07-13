package com.javaweb.controller;

import com.javaweb.dtos.request.PostTopicSearchRequest;
import com.javaweb.dtos.response.admin.PostTopicDTO;
import com.javaweb.services.PostTopicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/posttopics")
@RequiredArgsConstructor
public class PostTopicController {

    private final PostTopicService postTopicService;

    @GetMapping
    public List<PostTopicDTO> getAllPostTopics(@ModelAttribute @Valid PostTopicSearchRequest postTopicSearchRequest) {
        return postTopicService.getAllPostTopics(postTopicSearchRequest);
    }
}
