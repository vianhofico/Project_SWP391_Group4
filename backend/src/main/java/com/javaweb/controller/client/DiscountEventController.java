package com.javaweb.controller.client;

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

        // Lấy các event áp dụng cho TẤT CẢ hoặc cho course cụ thể
        List<DiscountEvent> activeEvents = discountEventRepository
                .findByStartDateLessThanEqualAndEndDateGreaterThanEqual(today, today);

        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Course course = courseOpt.get();

        // Tìm sự kiện giảm giá phù hợp với khóa học này
        DiscountEvent discount = activeEvents.stream()
                .filter(event ->
                        (event.getTargetType() == TargetType.ALL) ||
                                (event.getTargetType() == TargetType.PRODUCT && event.getCourse() != null && event.getCourse().getCourseId().equals(courseId))
                )
                .findFirst()
                .orElse(null);

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
        response.put("originalPrice", originalPrice);
        response.put("finalPrice", finalPrice);
        response.put("discountType", discount.getDiscountType());
        response.put("discountValue", discount.getDiscountValue());
        response.put("discounted", true);
        response.put("eventName", discount.getName());

        return ResponseEntity.ok(response);
    }


}
