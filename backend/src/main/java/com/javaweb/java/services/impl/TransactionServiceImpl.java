package com.javaweb.java.services.impl;


import com.javaweb.java.entities.Transaction;
import com.javaweb.java.converter.DTOConverter;
import com.javaweb.java.dtos.response.TransactionDTO;
import com.javaweb.java.repositories.TransactionRepository;
import com.javaweb.java.services.TransactionService;
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
