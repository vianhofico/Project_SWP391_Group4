package dev.likeech.java.mapper;

import dev.likeech.java.model.dto.TopicDTO;
import dev.likeech.java.entity.Course;
import dev.likeech.java.entity.Topic;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@RequiredArgsConstructor
@Component
public class TopicDTOConverter {
    private final ModelMapper modelMapper;
    public TopicDTO toTopicDTO(Topic entity) {
        TopicDTO dto = modelMapper.map(entity, TopicDTO.class);
        List<Course> courses = entity.getCourses();
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
