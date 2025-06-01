package com.javaweb.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.javaweb.dto.response.admin.UserDTO;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@Builder
public class ForumCommentDTO {

    private Long commentId;
    private String content;
    private String createdAt;
    private UserDTO user;
    private ForumCommentDTO parentComment;

}
