package dev.likeech.java.service;

import dev.likeech.java.model.request.CourseIdsRequest;
import dev.likeech.java.model.dto.CourseDTO;
import dev.likeech.java.model.dto.TopicDTO;
import dev.likeech.java.model.request.SearchRequest;
import dev.likeech.java.model.request.TopicRequest;
import dev.likeech.java.repository.entity.TopicEntity;

import java.util.List;

public interface TopicService {
    List<TopicDTO> searchByNameAndSort(SearchRequest topicSearchRequest);
    TopicEntity createTopic(TopicRequest topicRequest);
    TopicEntity updateTopic(TopicRequest topicRequest, Long id);
    TopicEntity getTopic(Long id);
    List<CourseDTO> addCourseInTopic(Long topicID, CourseIdsRequest courseIdsRequest);
    List<CourseDTO> deleteCoursesInTopic(Long topicID, CourseIdsRequest courseIdsRequest);
    TopicEntity deleteTopic(Long id);

}
