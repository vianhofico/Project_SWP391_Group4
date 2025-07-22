package com.javaweb.java.services.impl;


import com.javaweb.java.entities.Enrollment;
import com.javaweb.java.converter.DTOConverter;
import com.javaweb.java.dtos.response.EnrollmentDTO;
import com.javaweb.java.repositories.EnrollmentRepository;
import com.javaweb.java.services.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final DTOConverter dtoConverter;

    @Override
    public Page<EnrollmentDTO> getAllEnrollments(Long userId, Pageable pageable) {
        Page<Enrollment> pageEnrollments = enrollmentRepository.findByUserUserId(userId, pageable);
        return pageEnrollments.map(dtoConverter::toEnrollmentDTO);
    }
}
