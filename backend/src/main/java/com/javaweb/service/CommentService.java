package com.javaweb.service;

import com.javaweb.dto.CommentDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CommentService {

    public Page<CommentDTO> getAllComments(Long userId, Pageable pageable);

}
