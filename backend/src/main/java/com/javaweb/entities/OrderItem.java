package com.javaweb.entities;

import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id")  
    private Long orderItemId;

    @Column(name = "price")
    private Long price;

    @ManyToOne
    @JoinColumn(name = "course_id")  
    private Course course;

    @ManyToOne
    @JoinColumn(name = "order_id")  
    private Order order;
}
