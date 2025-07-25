package com.javaweb.services;

import com.javaweb.dtos.request.CourseIdsRequest;
import com.javaweb.dtos.request.SearchRequest;
import com.javaweb.dtos.request.TopicRequest;
import com.javaweb.dtos.response.CourseDTO;
import com.javaweb.dtos.response.TopicDTO;
import com.javaweb.entities.Topic;
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
