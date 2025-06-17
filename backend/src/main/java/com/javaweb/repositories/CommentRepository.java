package com.javaweb.repositories;

import com.javaweb.entities.Comment;
import com.javaweb.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    Page<Comment> findByUserUserId(Long userId, Pageable pageable);

    List<Comment> findByParentCommentCommentId(Long parentCommentId);

    @Query("SELECT c FROM Comment c WHERE (:content IS NULL OR c.content LIKE %:content%) " +
            "AND (:userFullName IS NULL OR c.user.fullName LIKE %:userFullName% ) " +
            "AND c.post.postId = :postId")
    Page<Comment> findAllCommentsByPostId(Long postId, String content, String userFullName, Pageable pageable);

    String user(User user);
}
