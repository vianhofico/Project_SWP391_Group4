package dev.likeech.java.mapper;
import dev.likeech.java.model.dto.CourseDTO;
import dev.likeech.java.repository.TopicRepository;
import dev.likeech.java.repository.entity.CourseEntity;
import dev.likeech.java.repository.entity.TopicEntity;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@RequiredArgsConstructor
@Component
public class CourseDTOConverter {
    private final ModelMapper modelMapper;
    private final TopicRepository  topicRepository;
    public CourseDTO toCourseDTO(CourseEntity courseEntity) {
        CourseDTO courseDTO = modelMapper.map(courseEntity, CourseDTO.class);
        courseDTO.setStatus(courseEntity.getStatus() ? "Active" : "Inactive");
        courseDTO.setImageUrl(courseEntity.getImageUrl());
        courseDTO.setVideoTrialUrl(courseEntity.getVideoTrialUrl());
        String topicNames = courseEntity.getTopics()
                .stream()
                .map(TopicEntity::getName)
                .collect(Collectors.joining(", "));
        courseDTO.setTopic(topicNames);
        return courseDTO;
    }

}
