package com.javaweb.java.services;

import com.javaweb.java.dtos.response.LessonResourceDTO;
import com.javaweb.java.dtos.request.ResourceCreateRequest;
import com.javaweb.java.dtos.request.ResourceFilterRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface LessonResourceService {
    LessonResourceDTO createResource(ResourceCreateRequest request);
    Page<LessonResourceDTO> getResourcesInLesson(Long lessonId, ResourceFilterRequest filter);
    Page<LessonResourceDTO> getResourcesNotInLesson(Long lessonId, ResourceFilterRequest filter);
    void assignResourcesToLesson(Long lessonId, List<Long> resourceIds);
    void removeResourcesFromLesson(Long lessonId, List<Long> resourceIds);
}
