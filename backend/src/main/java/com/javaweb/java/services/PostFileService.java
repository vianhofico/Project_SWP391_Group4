package com.javaweb.java.services;


import com.javaweb.java.dtos.response.PostFileDTO;

import java.util.List;

public interface PostFileService {

    List<PostFileDTO> getPostFilesByPostId(Long postId);

}
