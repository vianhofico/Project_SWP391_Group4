package com.javaweb.controller.client;

import com.javaweb.dtos.response.CourseDTO;
import com.javaweb.entities.Course;
import com.javaweb.entities.DiscountEvent;

import com.javaweb.enums.DiscountType;
import com.javaweb.repository.CourseRepository;
import com.javaweb.repository.DiscountEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
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

        List<DiscountEvent> activeEvents = discountEventRepository
                .findByCourse_CourseIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        courseId, today, today
                );

        if (activeEvents.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "courseId", courseId,
                    "discounted", false
            ));
        }

        DiscountEvent discount = activeEvents.get(0); // lấy sự kiện đầu tiên
        Optional<Course> courseOpt = courseRepository.findById(courseId);
//        Optional<CourseDTO> courseOpt = courseRepository.findById(courseId);

        if (courseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Course course = courseOpt.get();
//        CourseDTO course = courseOpt.get();
        double originalPrice = course.getPrice();
        double finalPrice;

        if (discount.getDiscountType() == DiscountType.PERCENT) {
            finalPrice = originalPrice * (1 - discount.getDiscountValue() / 100);
        } else {
            finalPrice = originalPrice - discount.getDiscountValue();
        }

        if (finalPrice < 0) finalPrice = 0;

        return ResponseEntity.ok(Map.of(
                "courseId", courseId,
                "originalPrice", originalPrice,
                "finalPrice", finalPrice,
                "discountType", discount.getDiscountType(),
                "discountValue", discount.getDiscountValue(),
                "discounted", true,
                "eventName", discount.getName()
        ));
    }
}
