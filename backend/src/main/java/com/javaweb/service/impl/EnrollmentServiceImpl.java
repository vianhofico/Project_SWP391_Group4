package com.javaweb.service.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dto.response.admin.EnrollmentDTO;
import com.javaweb.entity.Enrollment;
import com.javaweb.repository.EnrollmentRepository;
import com.javaweb.service.EnrollmentService;
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
