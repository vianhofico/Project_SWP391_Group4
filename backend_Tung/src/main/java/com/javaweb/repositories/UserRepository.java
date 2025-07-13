package com.javaweb.repositories;

import com.javaweb.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    Optional<User> findByUserId(Long userId);

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE (:fullName IS NULL OR u.fullName LIKE %:fullName%) AND u.role = :role AND (:isActive IS NULL OR u.isActive = :isActive) ")
    Page<User> findAllUsers(String fullName, String role, Boolean isActive, Pageable pageable);

    @Query("SELECT COUNT(r) FROM Report r WHERE r.target.userId = :userId AND r.status = 'approved'")
    Integer getReportCount(Long userId);
}
