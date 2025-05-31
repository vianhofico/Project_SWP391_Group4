package com.javaweb.repository;

import com.javaweb.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    public Page<Comment> findByUserUserId(Long userId, Pageable pageable);

}
