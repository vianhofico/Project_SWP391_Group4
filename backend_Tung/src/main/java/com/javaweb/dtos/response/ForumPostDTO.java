package com.javaweb.dtos.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.javaweb.dtos.response.admin.PostTopicDTO;
import com.javaweb.dtos.response.admin.UserDTO;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@Builder
public class ForumPostDTO {

    private Long postId;
    private String title;
    private String content;
    private String createdAt;
    private List<ForumCommentDTO> comments = new ArrayList<>();
    private PostTopicDTO postTopic;
    private UserDTO user;
}
