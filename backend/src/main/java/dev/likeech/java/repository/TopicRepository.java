package dev.likeech.java.repository;

import dev.likeech.java.entity.Topic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TopicRepository extends JpaRepository<Topic, Long> {
   @Query("""
    SELECT t FROM Topic t
    WHERE (:search IS NULL OR LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%')))
      AND (:status IS NULL OR t.status = :status)
""")
   Page<Topic> searchTopics(@Param("search") String search,
                            @Param("status") Boolean status,
                            Pageable pageable);
   List<Topic> findByStatus(Boolean status);

}
