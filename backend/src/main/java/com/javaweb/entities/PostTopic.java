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
@Table(name = "post_topics")
public class PostTopic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_topic_id")  
    private Long postTopicId;

    @Column(name = "name")
    private String name;

    @Column(name = "created_at")  
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "postTopic", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    private List<Post> posts = new ArrayList<>();
}
