package dev.likeech.java.repository.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userId")
    private Long userId;

    @Column(name = "fullName")
    private String fullName;

    @Column(name = "email")
    private String email;

    @Column(name = "birthDate")
    private LocalDate birthDate;

    @Column(name = "password")
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    @Column(name = "isActive")
    private Boolean isActive;

    @Column(name = "reportCount")
    private Integer reportCount;

    @Column(name = "imageUrl")
    private String imageUrl;

    @ManyToMany
    @JoinTable(
            name = "User_Course",
            joinColumns = @JoinColumn(name = "userId"),
            inverseJoinColumns = @JoinColumn(name = "courseId")
    )
    private List<CourseEntity> courses;
}
