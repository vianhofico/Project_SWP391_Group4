package com.javaweb.repositories;

import com.javaweb.entities.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByUserUserId(Long userId, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.title LIKE %:title% " +
            "AND (p.postTopic.postTopicId = :postTopicId OR :postTopicId IS NULL) " +
            "AND (p.status = :status) ")
    Page<Post> findAllPosts(@Param("title") String title, Long postTopicId, String status, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.title LIKE %:title% AND p.postTopic.postTopicId = :postTopicId")
    Page<Post> findAllPostByPostTopicId(@Param("title") String title, @Param("postTopicId") Long postTopicId, Pageable pageable);

}
