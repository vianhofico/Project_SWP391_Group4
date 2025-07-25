package com.javaweb.controller.user;

import com.javaweb.dtos.response.TopicDTO;
import com.javaweb.services.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public/user/topics")
@Validated
public class PublicUserTopicController {
    private final TopicService topicService;
    @GetMapping()
    public ResponseEntity<List<TopicDTO>> getAllTopics(){
        return ResponseEntity.ok(topicService.getTopicsByStatus(true));
    }
}
