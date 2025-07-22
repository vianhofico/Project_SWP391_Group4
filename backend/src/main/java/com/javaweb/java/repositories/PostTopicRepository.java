package com.javaweb.java.repositories;


import com.javaweb.java.entities.PostTopic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostTopicRepository extends JpaRepository<PostTopic, Long> {

    @Query("SELECT pt FROM PostTopic pt WHERE pt.name LIKE %:name% ")
    Page<PostTopic> findPagePostTopics(String name, Pageable pageable);

    @Query("SELECT pt FROM PostTopic pt WHERE pt.name LIKE %:name% ")
    List<PostTopic> findAllPostTopics(String name);

    PostTopic findByName(String name);
}
