package com.javaweb.java.converter;

import com.javaweb.java.dtos.response.TopicDTO;
import com.javaweb.java.entities.Course;
import com.javaweb.java.entities.Topic;
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
