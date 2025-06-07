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
public class UserDTO {

    private Long userId;
    private String fullName;
    private String password;
    private String email;
    private String birthDate;
    private String role;
    private String createdAt;
    private String status;
    private Integer reportCount;
    private String imageUrl;

}
