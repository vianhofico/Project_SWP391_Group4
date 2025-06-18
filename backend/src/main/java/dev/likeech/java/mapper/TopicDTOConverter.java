package dev.likeech.java.mapper;

import dev.likeech.java.model.dto.TopicDTO;
import dev.likeech.java.repository.entity.CourseEntity;
import dev.likeech.java.repository.entity.TopicEntity;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@RequiredArgsConstructor
@Component
public class TopicDTOConverter {
    private final ModelMapper modelMapper;
    public TopicDTO toTopicDTO(TopicEntity entity) {
        TopicDTO dto = modelMapper.map(entity, TopicDTO.class);
        List<CourseEntity> courses = entity.getCourses();
        dto.setCourseCount(courses != null ? courses.size() : 0);
        Boolean status = entity.getStatus();
        if (Boolean.TRUE.equals(status)) {
            dto.setStatus("ACTIVE");
        } else {
            dto.setStatus("INACTIVE");
        }

        return dto;
    }

}
