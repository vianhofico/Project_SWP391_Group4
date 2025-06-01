package com.javaweb.service;

import com.javaweb.dto.response.admin.TransactionDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TransactionService {

    public Page<TransactionDTO> getAllTransactions(Long userId, Pageable pageable);
}
