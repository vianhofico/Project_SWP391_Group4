package com.javaweb.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "enrollments")  
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "enrollment_id")  
    private Long enrollmentId;

    @Column(name = "enrolled_at")  
    private LocalDateTime enrolledAt;

    @Column(name = "progress")
    private Float progress;

    @ManyToOne
    @JoinColumn(name = "user_id")  
    private User user;

    @ManyToOne
    @JoinColumn(name = "course_id")  
    private Course course;
}
