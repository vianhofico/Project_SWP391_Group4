package com.javaweb.repositories;

import com.javaweb.entities.PostTopic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostTopicRepository extends JpaRepository<PostTopic, Long> {

    @Query("SELECT pt FROM PostTopic pt WHERE pt.name LIKE %:name% ")
    Page<PostTopic> findPagePostTopics(@Param("name")String name, Pageable pageable);

    @Query("SELECT pt FROM PostTopic pt WHERE pt.name LIKE %:name% ")
    List<PostTopic> findAllPostTopics(@Param("name") String name);

    PostTopic findByName(String name);
}
