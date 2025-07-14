package dev.likeech.java.service.impl;
import dev.likeech.java.exp.AppException;
import dev.likeech.java.exp.ErrorCode;
import dev.likeech.java.mapper.CourseDTOConverter;
import dev.likeech.java.mapper.TopicDTOConverter;
import dev.likeech.java.model.request.CourseIdsRequest;
import dev.likeech.java.model.dto.CourseDTO;
import dev.likeech.java.model.dto.TopicDTO;
import dev.likeech.java.model.request.SearchRequest;
import dev.likeech.java.model.request.TopicRequest;
import dev.likeech.java.repository.CourseRepository;
import dev.likeech.java.repository.TopicRepository;
import dev.likeech.java.entity.Course;
import dev.likeech.java.entity.Topic;
import dev.likeech.java.service.CourseService;
import dev.likeech.java.service.TopicService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TopicServiceImpl implements TopicService {
    private final TopicRepository topicRepository;
    private final TopicDTOConverter topicDTOConverter;
    private final CourseDTOConverter courseDTOConverter;
    private final CourseRepository courseRepository;
    private final CourseService courseService;

    @Override
    public Page<TopicDTO> searchByNameAndSort(SearchRequest request) {
        String search = (request.search() != null && !request.search().isBlank())
                ? request.search().trim() : null;

        Boolean status = null;
        if ("true".equalsIgnoreCase(request.status())) status = true;
        else if ("false".equalsIgnoreCase(request.status())) status = false;

        String sortField = request.field() != null && !request.field().isBlank()
                ? request.field()
                : "topicId";

        Sort.Direction direction = Sort.Direction.fromString(
                request.order() != null ? request.order() : "asc"
        );

        Pageable pageable = PageRequest.of(
                Math.max(request.page(), 0),
                Math.max(request.size(), 1),
                Sort.by(direction, sortField)
        );

        Page<Topic> result = topicRepository.searchTopics(search, status, pageable);

        return result.map(topicDTOConverter::toTopicDTO);
    }

    @Override
    @Transactional
    public Topic createTopic(TopicRequest requests) {
        Topic topic = new Topic();
        topic.setName(requests.getName());
        topic.setDescription(requests.getDescription());
        if(requests.getStatus() == null || requests.getStatus().equals("inactive")){
            topic.setStatus(false);
        }
        else if(requests.getStatus().equals("active")){
            topic.setStatus(true);
        }
        return  topicRepository.save(topic);
    }
    @Override
    @Transactional
    public Topic updateTopic(TopicRequest topicRequest, Long id) {
        Topic topic = topicRepository.findById(id).orElseThrow(
                () -> new AppException(ErrorCode.TOPIC_NOT_FOUND));
        topic.setName(topicRequest.getName());
        topic.setDescription(topicRequest.getDescription());
        boolean isCurrentlyActive = topic.getStatus() != null && topic.getStatus();
        boolean willBeActive = topicRequest.getStatus() != null && topicRequest.getStatus().equals("ACTIVE");
        if(isCurrentlyActive && !willBeActive){
            List<CourseDTO> courseDTOS = courseService.getCoursesInTopic(id);
            List<Long> courseIds = courseDTOS.stream()
                    .map(CourseDTO::getCourseId)
                    .toList();

            if (!courseIds.isEmpty()) {
                CourseIdsRequest courseIdsRequest = new CourseIdsRequest();
                courseIdsRequest.setCourseIds(courseIds);
                deleteCoursesInTopic(id, courseIdsRequest);
            }
            topic.setStatus(false);

        }
        else if(!isCurrentlyActive && willBeActive){
            topic.setStatus(true);
        }
        return topicRepository.save(topic);
    }


    @Override
    public Topic getTopic(Long id) {
        return  topicRepository.findById(id).orElseThrow(
                () -> new AppException(ErrorCode.TOPIC_NOT_FOUND)
        );
    }

    @Override
    @Transactional
    public List<CourseDTO> addCourseInTopic(Long topicID, CourseIdsRequest courseIdsRequest) {
        Topic topic = topicRepository.findById(topicID).orElseThrow(
                () -> new AppException(ErrorCode.TOPIC_NOT_FOUND));
        List<Course> courses = courseRepository.findAllById(courseIdsRequest.getCourseIds());
        for(Course course : courses) {
            if (!topic.getCourses().contains(course)) {
                topic.getCourses().add(course);
                course.setUpdateAt(LocalDateTime.now());
                course.getTopics().add(topic);
                courseRepository.save(course);
            }
        }
        List<CourseDTO> courseDTOS = new ArrayList<>();
        for (Course course : topic.getCourses()) {
            CourseDTO courseDTO = courseDTOConverter.toCourseDTO(course);
            courseDTOS.add(courseDTO);
        }
        topicRepository.save(topic);
        return courseDTOS;
    }

    @Override
    @Transactional
    public List<CourseDTO> deleteCoursesInTopic(Long topicID, CourseIdsRequest courseIdsRequest) {
        Topic topic = topicRepository.findById(topicID)
                .orElseThrow(() -> new AppException(ErrorCode.TOPIC_NOT_FOUND));

        List<Course> courses = courseRepository.findAllById(courseIdsRequest.getCourseIds());

        for (Course course : courses) {
            boolean removedFromCourse = course.getTopics().remove(topic);
            boolean removedFromTopic = topic.getCourses().remove(course);
            if (removedFromCourse || removedFromTopic) {
                course.setUpdateAt(LocalDateTime.now());
            }
        }
        topicRepository.save(topic);
        courseRepository.saveAll(courses);
        return topic.getCourses().stream()
                .map(courseDTOConverter::toCourseDTO)
                .toList();
    }
    @Override
    @Transactional
    public Topic deleteTopic(Long id) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Topic not found with id: " + id));
        if (Boolean.TRUE.equals(topic.getStatus())) {
            throw new IllegalStateException("Cannot delete an active topic.");
        }
        if (topic.getCourses() != null && !topic.getCourses().isEmpty()) {
            throw new IllegalStateException("Cannot delete topic with existing courses.");
        }
        topicRepository.delete(topic);
        return topic;
    }

    @Override
    public List<TopicDTO> getAllTopics() {
        List<Topic> topicEntities = topicRepository.findAll();
        List<TopicDTO> topicDTOS = new ArrayList<>();
        for (Topic topic : topicEntities) {
            TopicDTO topicDTO = topicDTOConverter.toTopicDTO(topic);
            topicDTOS.add(topicDTO);
        }
        return topicDTOS;
    }

    @Override
    public List<TopicDTO> getTopicsByStatus(Boolean status) {
        List<Topic> topicEntities = topicRepository.findByStatus(status);
        List<TopicDTO> topicDTOS = new ArrayList<>();
        for (Topic topic : topicEntities) {
            TopicDTO topicDTO = topicDTOConverter.toTopicDTO(topic);
            topicDTOS.add(topicDTO);
        }
        return topicDTOS;
    }


}
