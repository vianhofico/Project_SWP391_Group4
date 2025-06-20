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
@Table(name = "notifications")  
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")  
    private Long notificationId;

    @Column(name = "title")
    private String title;

    @Column(name = "content")
    private String content;

    @Column(name = "created_at")  
    private LocalDateTime createdAt;

    @ManyToMany
    @JoinTable(
            name = "user_notifications",
            joinColumns = @JoinColumn(name = "notification_id"),  
            inverseJoinColumns = @JoinColumn(name = "user_id")    
    )
    private List<User> users = new ArrayList<>();
}
