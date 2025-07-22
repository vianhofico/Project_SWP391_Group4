package com.javaweb.java.services;


import com.javaweb.java.dtos.response.TransactionDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TransactionService {

    Page<TransactionDTO> getAllTransactions(Long userId, Pageable pageable);
}
