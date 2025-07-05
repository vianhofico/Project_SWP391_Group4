package com.javaweb.entities;


import com.fasterxml.jackson.annotation.JsonBackReference;
//import com.javaweb.entities.dto.response.CourseDTO;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

@Entity
@Table(name = "OrderItems")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orderItemId")
    private Long orderItemId;

    @Column(name = "price")
    private double price;

    @ManyToOne
    @JoinColumn(name = "courseId")
//    @JsonBackReference
    @JsonManagedReference
    private Course course;
//    private CourseDTO courseDTO;

    @ManyToOne
    @JoinColumn(name = "order_id")
//    @JsonIgnore
    @JsonBackReference
    private Order order;


    public Long getOrderItemId() {
        return orderItemId;
    }

    public void setOrderItemId(Long orderItemId) {
        this.orderItemId = orderItemId;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }
}
