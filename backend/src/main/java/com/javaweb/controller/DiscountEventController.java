package com.javaweb.controller;

import com.javaweb.entities.Course;
import com.javaweb.entities.DiscountEvent;

import com.javaweb.enums.DiscountType;
import com.javaweb.enums.TargetType;
import com.javaweb.repositories.CourseRepository;
import com.javaweb.repositories.DiscountEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/client/discounts")
public class DiscountEventController {

    @Autowired
    private DiscountEventRepository discountEventRepository;

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getDiscountForCourse(@PathVariable Long courseId) {
        LocalDate today = LocalDate.now();

        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Course course = courseOpt.get();

        // 1. Ưu tiên sự kiện áp dụng riêng cho khoá học
        List<DiscountEvent> specificEvents = discountEventRepository
                .findByCourse_CourseIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(courseId, today, today);

        DiscountEvent discount = null;

        if (!specificEvents.isEmpty()) {
            discount = specificEvents.get(0); // Ưu tiên PRODUCT
        } else {
            // 2. Nếu không có, fallback sang sự kiện ALL
            List<DiscountEvent> globalEvents = discountEventRepository
                    .findByTargetTypeAndStartDateLessThanEqualAndEndDateGreaterThanEqual(TargetType.ALL, today, today);

            if (!globalEvents.isEmpty()) {
                discount = globalEvents.get(0);
            }
        }

        if (discount == null) {
            return ResponseEntity.ok(Map.of(
                    "courseId", courseId,
                    "discounted", false
            ));
        }

        double originalPrice = course.getPrice();
        double finalPrice;

        if (discount.getDiscountType() == DiscountType.PERCENT) {
            finalPrice = originalPrice * (1 - discount.getDiscountValue() / 100);
        } else {
            finalPrice = originalPrice - discount.getDiscountValue();
        }

        if (finalPrice < 0) finalPrice = 0;

        Map<String, Object> response = new HashMap<>();
        response.put("courseId", courseId);
        response.put("name", discount.getName());
        response.put("originalPrice", originalPrice);
        response.put("finalPrice", finalPrice);
        response.put("discountType", discount.getDiscountType());
        response.put("discountValue", discount.getDiscountValue());
        response.put("startDate", discount.getStartDate());
        response.put("endDate", discount.getEndDate());
        response.put("discounted", true);
        response.put("eventName", discount.getName());

        return ResponseEntity.ok(response);
    }


}
