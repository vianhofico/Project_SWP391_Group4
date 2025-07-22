package com.javaweb.java.repositories;

import com.javaweb.java.entities.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    Page<Comment> findByUserUserId(Long userId, Pageable pageable);

    @Query("SELECT c FROM Comment c WHERE (:content IS NULL OR c.content LIKE %:content%) " +
            "AND (:userFullName IS NULL OR c.user.fullName LIKE %:userFullName% ) " +
            "AND c.post.postId = :postId AND (c.status = :status OR :status IS NULL)")
    Page<Comment> findAllCommentsByPostId(Long postId, String content, String userFullName, String status, Pageable pageable);

    @Query("SELECT c FROM Comment c WHERE c.post.postId = :postId " +
            "AND c.status = :status AND c.parentComment IS NULL")
    Page<Comment> findAllTopLevelCommentsByPostId(Long postId, String status, Pageable pageable);

    @Query("SELECT c FROM Comment c WHERE c.status = :status " +
            "AND c.parentComment.commentId = :parentCommentId")
    Page<Comment> findCommentsByParentCommentId(Long parentCommentId, String status, Pageable pageable);

}
