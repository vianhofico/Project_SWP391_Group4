package com.javaweb.services.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dtos.response.admin.TransactionDTO;
import com.javaweb.entities.Transaction;
import com.javaweb.repositories.TransactionRepository;
import com.javaweb.services.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository; // Assuming you have a TransactionRepository
    private final DTOConverter dtoConverter;

    @Override
    public Page<TransactionDTO> getAllTransactions(Long userId, Pageable pageable) {
        Page<Transaction> pageTransactions = transactionRepository.findByUserUserId(userId, pageable);
        return pageTransactions.map(dtoConverter::toTransactionDTO);
    }
}
