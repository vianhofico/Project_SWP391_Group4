package dev.likeech.java.service.impl;


import dev.likeech.java.entity.Post;
import dev.likeech.java.entity.PostFile;
import dev.likeech.java.exp.ResourceNotFoundException;
import dev.likeech.java.mapper.DTOConverter;
import dev.likeech.java.model.dto.PostFileDTO;
import dev.likeech.java.repository.PostFileRepository;
import dev.likeech.java.repository.PostRepository;
import dev.likeech.java.service.PostFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostFileServiceImpl implements PostFileService {

    private final PostFileRepository postFileRepository;
    private final PostRepository postRepository;
    private final DTOConverter dtoConverter;

    @Override
    public List<PostFileDTO> getPostFilesByPostId(Long postId) {
        Post thisPost = postRepository.findById(postId).orElseThrow(
                () -> new ResourceNotFoundException("Not found post with id: " + postId)
        );

        List<PostFile> postFiles = postFileRepository.findByPostPostId(postId);

        return postFiles.stream().map(dtoConverter::toPostFileDTO).toList();
    }
}
