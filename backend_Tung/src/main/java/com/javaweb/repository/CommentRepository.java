package com.javaweb.repositories;

import com.javaweb.entities.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    Page<Comment> findByUserUserId(Long userId, Pageable pageable);

    List<Comment> findByParentCommentCommentId(Long parentCommentId);

}
