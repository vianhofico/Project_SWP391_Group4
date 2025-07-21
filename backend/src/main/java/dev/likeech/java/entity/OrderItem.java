package dev.likeech.java.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
    // private Long price;
    private Double price;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "course_id")  
    @JsonIgnore
    private Course course;

    @ManyToOne
    @JoinColumn(name = "order_id")  
    @JsonIgnore
    private Order order;
}
