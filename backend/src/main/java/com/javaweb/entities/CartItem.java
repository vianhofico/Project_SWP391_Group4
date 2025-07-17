package com.javaweb.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
//import com.javaweb.entities.dto.response.CourseDTO;
import jakarta.persistence.*;

@Entity
@Table(name = "cart_item")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
//    @JsonIgnore
    @JsonBackReference
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    private double price;

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

//    public CourseDTO getCourseDTO() {
//        return course;
//    }

//    public void setCourseDTO(CourseDTO course) {
//        this.course = course;
//    }


    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }
}
