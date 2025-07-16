package com.javaweb.entities;

import com.javaweb.enums.ReportType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "reports")  
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")  
    private Long reportId;

    @Column(name = "content") // sẽ không null nếu reportType = OTHER
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "report_type")
    private ReportType reportType;

    @Column(name = "created_at")  
    private LocalDateTime createdAt;

    @Column(name = "status", length = 20)
    private String status;

    @ManyToOne
    @JoinColumn(name = "reporter_id")  
    private User reporter;

    @ManyToOne
    @JoinColumn(name = "target_id")  
    private User target;

    @ManyToOne
    @JoinColumn(name = "post_id")  
    private Post post;

    @ManyToOne
    @JoinColumn(name = "comment_id")  
    private Comment comment;
}
