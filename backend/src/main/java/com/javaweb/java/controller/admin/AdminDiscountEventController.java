package com.javaweb.java.controller.admin;


import com.javaweb.java.entities.Course;
import com.javaweb.java.entities.DiscountEvent;
import com.javaweb.java.enums.DiscountType;
import com.javaweb.java.enums.TargetType;
import com.javaweb.java.converter.DTOConverter;
import com.javaweb.java.dtos.response.DiscountEventDTO;
import com.javaweb.java.repositories.CourseRepository;
import com.javaweb.java.repositories.DiscountEventRepository;
import com.javaweb.java.services.DiscountEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/discount-events")
@CrossOrigin
public class AdminDiscountEventController {

    @Autowired
    private DiscountEventRepository discountEventRepository;

    private final DiscountEventService discountEventService;

    private final CourseRepository courseRepository;

    private final DTOConverter dtoConverter;

    public AdminDiscountEventController(DiscountEventService discountEventService, CourseRepository courseRepository, DTOConverter dtoConverter) {
        this.discountEventService = discountEventService;
        this.courseRepository = courseRepository;
        this.dtoConverter = dtoConverter;
    }

    @GetMapping("/courses")
    public List<Map<String, Object>> getCourses() {
        return courseRepository.findAll().stream().map(course -> {
            Map<String, Object> map = new HashMap<>();
            map.put("courseId", course.getCourseId());
            map.put("title", course.getTitle());
            return map;
        }).collect(Collectors.toList());
    }


    @GetMapping
    public List<DiscountEventDTO> getAllEvents() {
        List<DiscountEvent> discountEvents = discountEventRepository.findAllWithCourse();
        List<DiscountEventDTO> discountEventDTOs = new ArrayList<>();
        for (DiscountEvent discountEvent : discountEvents) {
            DiscountEventDTO eventDTO = dtoConverter.toDiscountEventDTO(discountEvent);
            discountEventDTOs.add(eventDTO);
        }
        return discountEventDTOs;
    }

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Map<String, Object> payload) {
        DiscountEvent event = new DiscountEvent();

        event.setName((String) payload.get("name"));
        event.setStartDate(LocalDate.parse((String) payload.get("startDate")));
        event.setEndDate(LocalDate.parse((String) payload.get("endDate")));
        event.setDiscountType(DiscountType.valueOf((String) payload.get("discountType")));
        event.setDiscountValue(Double.valueOf(payload.get("discountValue").toString()));
        event.setNote((String) payload.get("note"));

        event.setTargetType(payload.get("targetType") != null
                ? TargetType.valueOf(payload.get("targetType").toString())
                : TargetType.ALL); // default fallback

        if (payload.get("courseId") != null) {
            Long courseId = Long.valueOf(payload.get("courseId").toString());
            Course course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new RuntimeException("Course not found"));
            event.setCourse(course);
        }

        discountEventRepository.save(event);
        return ResponseEntity.ok(event);
    }


    @PutMapping("/{id}")
    public DiscountEvent update(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        DiscountEvent existing = discountEventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        existing.setName((String) payload.get("name"));
        existing.setStartDate(LocalDate.parse((String) payload.get("startDate")));
        existing.setEndDate(LocalDate.parse((String) payload.get("endDate")));
        existing.setDiscountType(DiscountType.valueOf((String) payload.get("discountType")));
        existing.setDiscountValue(Double.parseDouble(payload.get("discountValue").toString()));
        existing.setNote((String) payload.get("note"));

// Thêm dòng này để cập nhật targetType
        existing.setTargetType(payload.get("targetType") != null
                ? TargetType.valueOf(payload.get("targetType").toString())
                : TargetType.ALL);

        Object courseIdObj = payload.get("courseId");
        if (courseIdObj != null) {
            Long courseId = Long.parseLong(courseIdObj.toString());
            Course course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new RuntimeException("Course not found"));
            existing.setCourse(course);
        } else {
            existing.setCourse(null);
        }

        return discountEventRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiscountEvent(@PathVariable Long id) {
        discountEventService.delete(id);
        return ResponseEntity.noContent().build();
    }


}
