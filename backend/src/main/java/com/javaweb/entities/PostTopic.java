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
@Table(name = "PostTopics")
public class PostTopic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "postTopicId")
    private Long postTopicId;

    @Column(name = "name")
    private String name;

    @Column(name = "createdAt")
    LocalDateTime createdAt;

    @OneToMany(mappedBy = "postTopic", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY   )
    private List<Post> posts = new ArrayList<>();

}
