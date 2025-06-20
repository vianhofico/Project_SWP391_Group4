package com.javaweb.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "comments")  
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")  
    private Long commentId;

    @Lob
    @Column(name = "content")
    private String content;

    @Column(name = "created_at")  
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")  
    private User user;

    @ManyToOne
    @JoinColumn(name = "parent_comment_id")  
    private Comment parentComment;

    @ManyToOne
    @JoinColumn(name = "post_id")  
    private Post post;

    @OneToMany(mappedBy = "parentComment", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    private List<Comment> childComments = new ArrayList<>();

    @OneToMany(mappedBy = "comment", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    private List<Report> reports = new ArrayList<>();

    // Nếu muốn thêm lại liên kết tới lesson:
    // @ManyToOne
    // @JoinColumn(name = "lesson_id")
    // private Lesson lesson;
}
