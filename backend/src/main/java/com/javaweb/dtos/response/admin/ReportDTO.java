package com.javaweb.dtos.response.admin;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@ToString(exclude = {"reporter", "target"})
public class ReportDTO {

    private Long reportId;
    private String content;
    private String status;
    private String createdAt;
    private PostDTO post;
    private CommentDTO comment;
    private UserDTO reporter;
    private UserDTO target;

}
