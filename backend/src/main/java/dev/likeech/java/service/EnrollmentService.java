package dev.likeech.java.service;


import dev.likeech.java.model.dto.EnrollmentDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EnrollmentService {

    Page<EnrollmentDTO> getAllEnrollments(Long userId, Pageable pageable);

}
