package com.javaweb.repositories;

import com.javaweb.entities.PostTopic;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostTopicRepository extends JpaRepository<PostTopic, Long> {

    @Query("SELECT pt FROM PostTopic pt WHERE pt.name LIKE %:name% ")
    List<PostTopic> findAllPostTopics(String name, Sort sort);

}
