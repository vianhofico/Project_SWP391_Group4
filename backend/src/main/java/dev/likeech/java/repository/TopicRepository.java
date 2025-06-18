package dev.likeech.java.repository;

import dev.likeech.java.repository.entity.TopicEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TopicRepository extends JpaRepository<TopicEntity, Long> {
   List<TopicEntity> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description );
}
