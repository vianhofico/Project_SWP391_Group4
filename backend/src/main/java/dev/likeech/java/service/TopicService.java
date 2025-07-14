package dev.likeech.java.service;

import dev.likeech.java.model.request.CourseIdsRequest;
import dev.likeech.java.model.dto.CourseDTO;
import dev.likeech.java.model.dto.TopicDTO;
import dev.likeech.java.model.request.SearchRequest;
import dev.likeech.java.model.request.TopicRequest;
import dev.likeech.java.entity.Topic;
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
