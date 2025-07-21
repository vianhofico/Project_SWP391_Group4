package dev.likeech.java.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReportDTO {

    private Long reportId;
    private String content;
    private String status;
    private String createdAt;
    private String reportType;
    private PostDTO post;
    private CommentDTO comment;
    private UserDTO reporter;
    private UserDTO target;

}
