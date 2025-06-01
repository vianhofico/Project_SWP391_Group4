package com.javaweb.repository;

import com.javaweb.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {

    public Page<Post> findByUserUserId(Long userId, Pageable pageable);

    public Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);

    public Page<Post> findByPostTopicPostTopicIdOrderByCreatedAtDesc(Long postTopicId, Pageable pageable);
}
