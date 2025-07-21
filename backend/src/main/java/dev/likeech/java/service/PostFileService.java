package dev.likeech.java.service;


import dev.likeech.java.model.dto.PostFileDTO;

import java.util.List;

public interface PostFileService {

    List<PostFileDTO> getPostFilesByPostId(Long postId);

}
