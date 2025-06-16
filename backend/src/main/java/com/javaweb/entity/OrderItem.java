package com.javaweb.entity;


import com.javaweb.entity.dto.CourseDTO;
import jakarta.persistence.*;
import org.hibernate.mapping.ToOne;

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
    private CourseDTO courseDTO;

    @ManyToOne
    @JoinColumn(name = "orderId")
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

    public CourseDTO getCourseDTO() {
        return courseDTO;
    }

    public void setCourseDTO(CourseDTO courseDTO) {
        this.courseDTO = courseDTO;
    }

    public CourseDTO getCourse() {
        return courseDTO;
    }

    public void setCourse(CourseDTO courseDTO) {
        this.courseDTO = courseDTO;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }
}
