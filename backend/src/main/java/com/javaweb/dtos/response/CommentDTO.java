package com.javaweb.dtos.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class CommentDTO {

    private Long commentId;
    private String content;
    private String createdAt;
    private String status;
    private CommentDTO parentComment;
    private PostDTO post;
    private UserDTO user;
    private List<CommentDTO> replies;
}
