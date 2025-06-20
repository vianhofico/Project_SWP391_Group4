package com.javaweb.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "transactions")  
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")  
    private Long transactionId;

    @Column(name = "amount")
    private Long amount;

    @Column(name = "paid_at")  
    private LocalDateTime paidAt;

    @ManyToOne
    @JoinColumn(name = "user_id")  
    private User user;

    @OneToOne
    @JoinColumn(name = "order_id")  
    private Order order;
}
