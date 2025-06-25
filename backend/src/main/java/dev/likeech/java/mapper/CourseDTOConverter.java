package dev.likeech.java.mapper;
import dev.likeech.java.model.dto.CourseDTO;
import dev.likeech.java.repository.TopicRepository;
import dev.likeech.java.entity.AttachmentEntity;
import dev.likeech.java.entity.CourseEntity;
import dev.likeech.java.entity.TopicEntity;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Component
public class CourseDTOConverter {
    private final ModelMapper modelMapper;
    private final TopicRepository  topicRepository;
    public CourseDTO toCourseDTO(CourseEntity courseEntity) {
        CourseDTO courseDTO = modelMapper.map(courseEntity, CourseDTO.class);
        courseDTO.setStatus(courseEntity.getStatus() ? "ACTIVE" : "INACTIVE");
        courseDTO.setImageUrl(courseEntity.getImageUrl());
        courseDTO.setVideoTrialUrl(courseEntity.getVideoTrialUrl());
        String topicNames = courseEntity.getTopics().stream()
                .map(TopicEntity::getName)
                .collect(Collectors.joining(", "));
        courseDTO.setTopic(topicNames);

        List<Long> attachmentIds = courseEntity.getAttachments().stream()
                .map(AttachmentEntity::getAttachmentId)
                .collect(Collectors.toList());
        courseDTO.setAttachmentIds(attachmentIds);
        List<Long> topicIds = courseEntity.getTopics().stream()
                .map(TopicEntity::getTopicId)
                .collect(Collectors.toList());
        courseDTO.setTopicIds(topicIds);
        return courseDTO;
    }
}


