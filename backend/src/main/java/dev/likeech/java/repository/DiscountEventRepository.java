package dev.likeech.java.repository;

import dev.likeech.java.entity.DiscountEvent;
import dev.likeech.java.enums.TargetType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DiscountEventRepository extends JpaRepository<DiscountEvent, Long> {

    // Tìm sự kiện giảm giá đang hoạt động cho một course cụ thể (ngày hiện tại nằm trong khoảng)
    List<DiscountEvent> findByCourse_CourseIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Long courseId,
            LocalDate today1,
            LocalDate today2
    );

    List<DiscountEvent> findByTargetTypeAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            TargetType targetType,
            LocalDate today1,
            LocalDate today2
    );


    // Tùy chọn: tìm tất cả event hiện tại (để áp dụng toàn cục nếu cần)
    List<DiscountEvent> findByStartDateLessThanEqualAndEndDateGreaterThanEqual(LocalDate now1, LocalDate now2);

    @Query("SELECT d FROM DiscountEvent d LEFT JOIN FETCH d.course")
    List<DiscountEvent> findAllWithCourse();
}
