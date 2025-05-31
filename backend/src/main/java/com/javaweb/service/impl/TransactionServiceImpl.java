package com.javaweb.service.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dto.TransactionDTO;
import com.javaweb.entity.Transaction;
import com.javaweb.repository.TransactionRepository;
import com.javaweb.service.TransactionService;
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
