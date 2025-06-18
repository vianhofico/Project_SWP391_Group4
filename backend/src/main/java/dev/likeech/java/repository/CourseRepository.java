package dev.likeech.java.repository;

import dev.likeech.java.repository.entity.CourseEntity;
import dev.likeech.java.repository.entity.TopicEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<CourseEntity, Long> {
    List<CourseEntity> findByTopicsNotContainingAndStatus(TopicEntity topicEntity, Boolean status);
    List<CourseEntity> findByTopics(TopicEntity topicEntity);
    CourseEntity findByCourseId(long id);
    boolean existsByImageUrlAndCourseIdNot(String imageUrl, Long id);
    boolean existsByVideoTrialUrlAndCourseIdNot(String videoTrialUrl, Long id);
    boolean existsByImageUrl(String imageUrl);
    boolean existsByVideoTrialUrl(String videoTrialUrl);
}
