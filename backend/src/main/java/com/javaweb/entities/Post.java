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
@Table(name = "posts")  
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")  
    private Long postId;

    @Column(name = "title")
    private String title;

    @Column(name = "content")
    private String content;

    @Column(name = "created_at")  
    private LocalDateTime createdAt;

    // DELETED / ACTIVE
    @Column(name = "status")
    private String status;

    @OneToMany(mappedBy = "post", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    private List<Comment> comments = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "post_topic_id")  
    private PostTopic postTopic;

    @ManyToOne
    @JoinColumn(name = "user_id")  
    private User user;

    @OneToMany(mappedBy = "post", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    private List<Report> reports = new ArrayList<>();
}
