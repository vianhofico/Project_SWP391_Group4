package com.javaweb.controller;

import com.javaweb.dto.response.admin.PostTopicDTO;
import com.javaweb.service.PostTopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/forum/topics")
@RequiredArgsConstructor
public class PostTopicController {

    private final PostTopicService postTopicService;

    @GetMapping
    public List<PostTopicDTO> getAllPostTopics(){
        return postTopicService.getAllPostTopics();
    }
}
