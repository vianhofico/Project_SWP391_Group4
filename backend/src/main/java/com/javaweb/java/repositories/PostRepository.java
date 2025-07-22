package com.javaweb.java.repositories;
import com.javaweb.java.entities.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByPostTopicPostTopicId(Long postTopicId);

    Page<Post> findByUserUserId(Long userId, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.title LIKE %:title% " +
            "AND (p.postTopic.postTopicId = :postTopicId OR :postTopicId IS NULL) " +
            "AND (p.status = :status) ")
    Page<Post> findAllPosts(@Param("title") String title, Long postTopicId, String status, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.title LIKE %:title% AND p.postTopic.postTopicId = :postTopicId AND p.status = :status")
    Page<Post> findAllPostByPostTopicId(@Param("title") String title, @Param("postTopicId") Long postTopicId, @Param("status") String status, Pageable pageable);

}
