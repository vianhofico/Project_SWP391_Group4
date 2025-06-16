package com.javaweb.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "Users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userId")
    private Long userId;

    @Column(name = "fullName", length = 100)
    private String fullName;

    @Column(name = "email", length = 100, nullable = false, unique = true)
    private String email;

    @Column(name = "birthDate")
    private LocalDate birthDate;

    @Column(name = "password", length = 255)
    private String password;

    @Column(name = "role", length = 20)
    private String role;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    @Column(name = "isActive")
    private Boolean isActive;

//        @OneToMany(mappedBy = "instructor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//        private List<Course> courses = new ArrayList<>();

//        @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//        private List<Comment> comments = new ArrayList<>();

//        @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//        private List<Rating> ratings = new ArrayList<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Cart cart;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Order> orders = new ArrayList<>();

//        @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//        private List<Score> scores = new ArrayList<>();

//        @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//        private List<Transaction> transactions = new ArrayList<>();

//        @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//        private List<Enrollment> enrollments = new ArrayList<>();

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

//        public List<Course> getCourses() {
//            return courses;
//        }

//        public void setCourses(List<Course> courses) {
//            this.courses = courses;
//        }

//        public List<Comment> getComments() {
//            return comments;
//        }

//        public void setComments(List<Comment> comments) {
//            this.comments = comments;
//        }

//        public List<Rating> getRatings() {
//            return ratings;
//        }

//        public void setRatings(List<Rating> ratings) {
//            this.ratings = ratings;
//        }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

//        public List<Score> getScores() {
//            return scores;
//        }

//        public void setScores(List<Score> scores) {
//            this.scores = scores;
//        }

//        public List<Transaction> getTransactions() {
//            return transactions;
//        }

//        public void setTransactions(List<Transaction> transactions) {
//            this.transactions = transactions;
//        }

//        public List<Enrollment> getEnrollments() {
//            return enrollments;
//        }

//        public void setEnrollments(List<Enrollment> enrollments) {
//            this.enrollments = enrollments;
//        }
}



