package dev.likeech.java.repository;

import dev.likeech.java.entity.Course;
import dev.likeech.java.entity.Topic;
import org.checkerframework.checker.units.qual.C;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByTopicsNotContaining(Topic topic);
    List<Course> findByTopics(Topic topic);
    Course findByCourseId(long id);
    boolean existsByImageUrlAndCourseIdNot(String imageUrl, Long id);
    boolean existsByVideoTrialUrlAndCourseIdNot(String videoTrialUrl, Long id);
    boolean existsByImageUrl(String imageUrl);
    boolean existsByVideoTrialUrl(String videoTrialUrl);
    @Query("SELECT DISTINCT c FROM Course c " +
            "JOIN c.topics t " +
            "WHERE (:topicId IS NULL OR t.topicId = :topicId) " +
            "AND (:search IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:status IS NULL OR c.status = :status)")
    Page<Course> findByFilter(
            @Param("topicId") Long topicId,
            @Param("search") String search,
            @Param("status") String status,
            Pageable pageable
    );
    @Query("SELECT c FROM Course c JOIN c.chapters ch WHERE ch.chapterId = :chapterId")
    Optional<Course> findByChapterId(@Param("chapterId") Long chapterId);
}
