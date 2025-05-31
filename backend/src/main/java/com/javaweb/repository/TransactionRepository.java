package com.javaweb.repository;

import com.javaweb.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    public Page<Transaction> findByUserUserId(Long userId, Pageable pageable);

}
