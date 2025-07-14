package dev.likeech.java.mapper;

import dev.likeech.java.entity.Attachment;
import dev.likeech.java.entity.Course;
import dev.likeech.java.entity.Enrollment;
import dev.likeech.java.entity.Topic;
import dev.likeech.java.model.dto.CourseDTO;
import dev.likeech.java.repository.TopicRepository;
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
