package dev.likeech.java.repository;

import dev.likeech.java.entity.TopicEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TopicRepository extends JpaRepository<TopicEntity, Long> {
   @Query("""
    SELECT t FROM TopicEntity t
    WHERE (:search IS NULL OR LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%')))
      AND (:status IS NULL OR t.status = :status)
""")
   Page<TopicEntity> searchTopics(@Param("search") String search,
                                  @Param("status") Boolean status,
                                  Pageable pageable);
}
