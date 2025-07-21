package dev.likeech.java.service.impl;


import dev.likeech.java.entity.Enrollment;
import dev.likeech.java.mapper.DTOConverter;
import dev.likeech.java.model.dto.EnrollmentDTO;
import dev.likeech.java.repository.EnrollmentRepository;
import dev.likeech.java.service.EnrollmentService;
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
