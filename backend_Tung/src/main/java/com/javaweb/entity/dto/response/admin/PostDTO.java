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
@ToString(exclude = {"postTopic"})
public class PostDTO {

    private Long postId;
    private String title;
    private String content;
    private String createdAt;
    private String status;
    private PostTopicDTO postTopic;
    private UserDTO user;
}
