package com.javaweb.converter;

import com.javaweb.dtos.response.CourseDTO;
import com.javaweb.entities.Attachment;
import com.javaweb.entities.Course;
import com.javaweb.entities.Enrollment;
import com.javaweb.entities.Topic;
import com.javaweb.repositories.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Component
public class CourseDTOConverter {

    private final ModelMapper modelMapper;
    private final TopicRepository topicRepository;

    // Dùng cho admin hoặc khi không cần progress
    public CourseDTO toCourseDTO(Course course) {
        return toCourseDTO(course, null);
    }

    // Dùng cho learner: truyền thêm progress
    public CourseDTO toCourseDTO(Course course, Float progress) {
        CourseDTO courseDTO = modelMapper.map(course, CourseDTO.class);
        courseDTO.setStatus(course.getStatus() ? "ACTIVE" : "INACTIVE");
        courseDTO.setImageUrl(course.getImageUrl());
        courseDTO.setVideoTrialUrl(course.getVideoTrialUrl());
        String topicNames = course.getTopics().stream()
                .map(Topic::getName)
                .collect(Collectors.joining(", "));
        courseDTO.setTopic(topicNames);

        // Set danh sách topicId
        List<Long> topicIds = course.getTopics().stream()
                .map(Topic::getTopicId)
                .collect(Collectors.toList());
        courseDTO.setTopicIds(topicIds);

        // Set attachmentId
        List<Long> attachmentIds = course.getAttachments().stream()
                .map(Attachment::getAttachmentId)
                .collect(Collectors.toList());
        courseDTO.setAttachmentIds(attachmentIds);

        // Set enrollmentId
        List<Long> enrollmentIds = course.getEnrollments().stream()
                .map(Enrollment::getEnrollmentId)
                .collect(Collectors.toList());
        courseDTO.setEnrollmentIds(enrollmentIds);
        if (progress != null) {
            courseDTO.setProgress(progress);
        }

        return courseDTO;
    }
}
