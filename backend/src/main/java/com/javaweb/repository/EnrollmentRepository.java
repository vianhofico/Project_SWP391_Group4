package com.javaweb.repository;

import com.javaweb.entity.Enrollment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    public Page<Enrollment> findByUserUserId(Long userId, Pageable pageable);
}
