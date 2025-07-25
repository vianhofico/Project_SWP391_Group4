package com.javaweb.services;

import com.javaweb.dtos.request.ResourceCreateRequest;
import com.javaweb.dtos.request.ResourceFilterRequest;
import com.javaweb.dtos.response.LessonResourceDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface LessonResourceService {
    LessonResourceDTO createResource(ResourceCreateRequest request);
    Page<LessonResourceDTO> getResourcesInLesson(Long lessonId, ResourceFilterRequest filter);
    Page<LessonResourceDTO> getResourcesNotInLesson(Long lessonId, ResourceFilterRequest filter);
    void assignResourcesToLesson(Long lessonId, List<Long> resourceIds);
    void removeResourcesFromLesson(Long lessonId, List<Long> resourceIds);
}
