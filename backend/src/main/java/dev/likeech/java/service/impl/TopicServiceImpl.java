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
import dev.likeech.java.entity.CourseEntity;
import dev.likeech.java.entity.TopicEntity;
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
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

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

        Page<TopicEntity> result = topicRepository.searchTopics(search, status, pageable);

        return result.map(topicDTOConverter::toTopicDTO);
    }

    @Override
    @Transactional
    public TopicEntity createTopic(TopicRequest requests) {
        TopicEntity topicEntity = new TopicEntity();
        topicEntity.setName(requests.getName());
        topicEntity.setDescription(requests.getDescription());
        if(requests.getStatus() == null || requests.getStatus().equals("inactive")){
            topicEntity.setStatus(false);
        }
        else if(requests.getStatus().equals("active")){
            topicEntity.setStatus(true);
        }
        return  topicRepository.save(topicEntity);
    }
    @Override
    @Transactional
    public TopicEntity updateTopic(TopicRequest topicRequest, Long id) {
        TopicEntity topicEntity = topicRepository.findById(id).orElseThrow(
                () -> new AppException(ErrorCode.TOPIC_NOT_FOUND));
        topicEntity.setName(topicRequest.getName());
        topicEntity.setDescription(topicRequest.getDescription());
        boolean isCurrentlyActive = topicEntity.getStatus() != null && topicEntity.getStatus();
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
            topicEntity.setStatus(false);

        }
        else if(!isCurrentlyActive && willBeActive){
            topicEntity.setStatus(true);
        }
        return topicRepository.save(topicEntity);
    }


    @Override
    public TopicEntity getTopic(Long id) {
        return  topicRepository.findById(id).orElseThrow(
                () -> new AppException(ErrorCode.TOPIC_NOT_FOUND)
        );
    }

    @Override
    @Transactional
    public List<CourseDTO> addCourseInTopic(Long topicID, CourseIdsRequest courseIdsRequest) {
        TopicEntity topicEntity = topicRepository.findById(topicID).orElseThrow(
                () -> new AppException(ErrorCode.TOPIC_NOT_FOUND));
        List<CourseEntity> courses = courseRepository.findAllById(courseIdsRequest.getCourseIds());
        for(CourseEntity course : courses) {
            if (!topicEntity.getCourses().contains(course)) {
                topicEntity.getCourses().add(course);
                course.setUpdateAt(LocalDateTime.now());
                course.getTopics().add(topicEntity);
                courseRepository.save(course);
            }
        }
        List<CourseDTO> courseDTOS = new ArrayList<>();
        for (CourseEntity course : topicEntity.getCourses()) {
            CourseDTO courseDTO = courseDTOConverter.toCourseDTO(course);
            courseDTOS.add(courseDTO);
        }
        topicRepository.save(topicEntity);
        return courseDTOS;
    }

    @Override
    @Transactional
    public List<CourseDTO> deleteCoursesInTopic(Long topicID, CourseIdsRequest courseIdsRequest) {
        TopicEntity topicEntity = topicRepository.findById(topicID)
                .orElseThrow(() -> new AppException(ErrorCode.TOPIC_NOT_FOUND));

        List<CourseEntity> courses = courseRepository.findAllById(courseIdsRequest.getCourseIds());

        for (CourseEntity course : courses) {
            boolean removedFromCourse = course.getTopics().remove(topicEntity);
            boolean removedFromTopic = topicEntity.getCourses().remove(course);
            if (removedFromCourse || removedFromTopic) {
                course.setUpdateAt(LocalDateTime.now());
            }
        }
        topicRepository.save(topicEntity);
        courseRepository.saveAll(courses);
        return topicEntity.getCourses().stream()
                .map(courseDTOConverter::toCourseDTO)
                .toList();
    }
    @Override
    @Transactional
    public TopicEntity deleteTopic(Long id) {
        TopicEntity topic = topicRepository.findById(id)
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
        List<TopicEntity> topicEntities = topicRepository.findAll();
        List<TopicDTO> topicDTOS = new ArrayList<>();
        for (TopicEntity topicEntity : topicEntities) {
            TopicDTO topicDTO = topicDTOConverter.toTopicDTO(topicEntity);
            topicDTOS.add(topicDTO);
        }
        return topicDTOS;
    }


}
