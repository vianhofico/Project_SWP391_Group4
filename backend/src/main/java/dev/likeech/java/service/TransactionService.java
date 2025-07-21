package dev.likeech.java.service;


import dev.likeech.java.model.dto.TransactionDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TransactionService {

    Page<TransactionDTO> getAllTransactions(Long userId, Pageable pageable);
}
