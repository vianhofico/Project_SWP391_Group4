package com.javaweb.service;

import com.javaweb.dto.EnrollmentDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EnrollmentService {

    public Page<EnrollmentDTO> getAllEnrollments(Long userId, Pageable pageable);

}
