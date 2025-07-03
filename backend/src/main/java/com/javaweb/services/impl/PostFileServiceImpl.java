package com.javaweb.services.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dtos.response.PostFileDTO;
import com.javaweb.entities.Post;
import com.javaweb.entities.PostFile;
import com.javaweb.exceptions.ResourceNotFoundException;
import com.javaweb.repositories.PostFileRepository;
import com.javaweb.repositories.PostRepository;
import com.javaweb.services.PostFileService;
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
