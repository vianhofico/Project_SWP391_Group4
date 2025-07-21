package dev.likeech.java.service.impl;


import dev.likeech.java.entity.Transaction;
import dev.likeech.java.mapper.DTOConverter;
import dev.likeech.java.model.dto.TransactionDTO;
import dev.likeech.java.repository.TransactionRepository;
import dev.likeech.java.service.TransactionService;
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
