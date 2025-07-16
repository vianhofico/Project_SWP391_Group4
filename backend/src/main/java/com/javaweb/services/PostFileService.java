package com.javaweb.services;

import com.javaweb.dtos.response.PostFileDTO;

import java.util.List;

public interface PostFileService {

    List<PostFileDTO> getPostFilesByPostId(Long postId);

}
