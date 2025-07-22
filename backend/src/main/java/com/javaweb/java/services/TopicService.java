package com.javaweb.java.services;

import com.javaweb.java.dtos.request.CourseIdsRequest;
import com.javaweb.java.dtos.response.CourseDTO;
import com.javaweb.java.dtos.response.TopicDTO;
import com.javaweb.java.dtos.request.SearchRequest;
import com.javaweb.java.dtos.request.TopicRequest;
import com.javaweb.java.entities.Topic;
import org.springframework.data.domain.Page;

import java.util.List;

public interface TopicService {
    Page<TopicDTO> searchByNameAndSort(SearchRequest request);
    Topic createTopic(TopicRequest topicRequest);
    Topic updateTopic(TopicRequest topicRequest, Long id);
    Topic getTopic(Long id);
    List<CourseDTO> addCourseInTopic(Long topicID, CourseIdsRequest courseIdsRequest);
    List<CourseDTO> deleteCoursesInTopic(Long topicID, CourseIdsRequest courseIdsRequest);
    Topic deleteTopic(Long id);
    List<TopicDTO> getAllTopics();
    List<TopicDTO> getTopicsByStatus(Boolean status);
}
