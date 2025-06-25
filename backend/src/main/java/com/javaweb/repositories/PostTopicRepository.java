package com.javaweb.repositories;

import com.javaweb.entities.PostTopic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PostTopicRepository extends JpaRepository<PostTopic, Long> {

    @Query("SELECT pt FROM PostTopic pt WHERE pt.name LIKE %:name% ")
    Page<PostTopic> findAllPostTopics(String name, Pageable pageable);

    PostTopic findByName(String name);
}
