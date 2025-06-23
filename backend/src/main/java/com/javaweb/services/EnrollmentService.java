package com.javaweb.services;

import com.javaweb.dtos.response.admin.EnrollmentDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EnrollmentService {

    Page<EnrollmentDTO> getAllEnrollments(Long userId, Pageable pageable);

}
