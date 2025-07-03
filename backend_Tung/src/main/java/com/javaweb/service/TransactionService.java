package com.javaweb.services;

import com.javaweb.dtos.response.admin.TransactionDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TransactionService {

    Page<TransactionDTO> getAllTransactions(Long userId, Pageable pageable);
}
