package dev.likeech.java.service;

import dev.likeech.java.model.dto.LessonResourceDTO;
import dev.likeech.java.model.request.ResourceCreateRequest;
import dev.likeech.java.model.request.ResourceFilterRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface LessonResourceService {
    LessonResourceDTO createResource(ResourceCreateRequest request);
    Page<LessonResourceDTO> getResourcesInLesson(Long lessonId, ResourceFilterRequest filter);
    Page<LessonResourceDTO> getResourcesNotInLesson(Long lessonId, ResourceFilterRequest filter);
    void assignResourcesToLesson(Long lessonId, List<Long> resourceIds);
    void removeResourcesFromLesson(Long lessonId, List<Long> resourceIds);
}
