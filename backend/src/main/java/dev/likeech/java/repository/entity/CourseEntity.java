package dev.likeech.java.repository.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(name = "Courses")
@Data
@NoArgsConstructor
@Setter
@Getter
@AllArgsConstructor
@Builder
public class CourseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "courseId")
    private Long courseId;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "price")
    private Long price;

    @Column(name = "updateAt")

    private LocalDateTime updateAt;
    @Column(name = "imageUrl")
    private String imageUrl;

    @Column(name = "videoTrialUrl")
    private String videoTrialUrl;

    @Column(name = "status")
    private Boolean status;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    @ManyToMany(mappedBy = "courses")
    private List<UserEntity> users;

    @ManyToMany
    @JoinTable(
            name = "Course_Topic",
            joinColumns = @JoinColumn(name = "courseId"),
            inverseJoinColumns = @JoinColumn(name = "topicId")
    )
    private List<TopicEntity> topics;

    @OneToMany(mappedBy = "course")
    private List<ChapterEntity> chapters;

    @ManyToMany
    @JoinTable(
            name = "Course_Attachment",
            joinColumns = @JoinColumn(name = "courseId"),
            inverseJoinColumns = @JoinColumn(name = "attachmentId")
    )
    private List<AttachmentEntity> attachments;

    @OneToMany(mappedBy = "course")
    private List<RatingEntity> ratings;
}
