package com.javaweb.java.services;


import com.javaweb.java.dtos.response.EnrollmentDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EnrollmentService {

    Page<EnrollmentDTO> getAllEnrollments(Long userId, Pageable pageable);

}
