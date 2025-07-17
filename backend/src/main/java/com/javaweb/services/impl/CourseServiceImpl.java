package com.javaweb.services.impl;

import com.javaweb.entities.*;
import com.javaweb.enums.DiscountType;
import com.javaweb.enums.TargetType;
import com.javaweb.repositories.*;
import com.javaweb.services.CourseService;
import com.javaweb.services.EnrollmentService;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class CourseServiceImpl implements CourseService {
    private final CartItemRepository cartItemRepository;
    private final UserServiceImpl userServiceImpl;
    private final CartRepository cartRepository;
    private final CourseRepository courseRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final DiscountEventRepository discountEventRepository;
    private final EnrollmentRepository enrollmentRepository;

    public List<Course> getAllCourses() {
        return this.courseRepository.findAll();
    }

    public Cart fetchByUser(User user) {
        return this.cartRepository.findByUser(user);
    }

    private User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            String email = null;

            if (principal instanceof UserDetails) {
                email = ((UserDetails) principal).getUsername();
            } else if (principal instanceof String) {
                email = (String) principal;
            }

            if (email != null) {
                return userServiceImpl.getUserByEmail(email).get();
            }
        }
        return null;
    }

    public void handleAddCourseToCart(long courseId) {
        User user = getCurrentAuthenticatedUser();
        if (user != null) {
            Cart cart = this.cartRepository.findByUser(user);
            if (cart == null) {
                cart = new Cart();
                cart.setUser(user);
                cart.setSum(0);
                cart = this.cartRepository.save(cart);
            }

            Optional<Course> courseOptional = this.courseRepository.findById(courseId);
            if (courseOptional.isPresent()) {
                Course course = courseOptional.get();
                double originalPrice = course.getPrice();
                double finalPrice = originalPrice;

                LocalDate today = LocalDate.now();
                List<DiscountEvent> activeEvents = this.discountEventRepository
                        .findByCourse_CourseIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(courseId, today, today);

                DiscountEvent activeDiscount = activeEvents.isEmpty() ? null : activeEvents.get(0);
                if (activeDiscount != null) {
                    if (activeDiscount.getDiscountType() == DiscountType.PERCENT) {
                        finalPrice = originalPrice * (1 - activeDiscount.getDiscountValue() / 100.0);
                    } else {
                        finalPrice = Math.max(originalPrice - activeDiscount.getDiscountValue(), 0);
                    }
                }

                CartItem existingItem = this.cartItemRepository.findByCartAndCourse(cart, course);
                if (existingItem == null) {
                    CartItem newItem = new CartItem();
                    newItem.setCart(cart);
                    newItem.setCourse(course);
                    newItem.setPrice(finalPrice);
                    this.cartItemRepository.save(newItem);

                    cart.setSum(cart.getSum() + 1);
                    this.cartRepository.save(cart);
                } else {
                    existingItem.setPrice(finalPrice);
                    this.cartItemRepository.save(existingItem);
                }
            }
        }
    }

    @Transactional
    public void handleRemoveCartItem(long id) {
        Optional<CartItem> cartItemOptional = this.cartItemRepository.findById(id);
        if (cartItemOptional.isPresent()) {
            User user = getCurrentAuthenticatedUser();
            if (user == null) return;

            Cart cart = this.cartRepository.findByUser(user);
            this.cartItemRepository.deleteById(id);

            int cartSum = cart.getSum();
            if (cartSum > 1) {
                cart.setSum(cartSum - 1);
                this.cartRepository.save(cart);
            } else {
                cartRepository.deleteCartItemsByCartId(cart.getId());
            }
        }
    }

    private double applyDiscount(double originalPrice, DiscountEvent event) {
        double value = event.getDiscountValue();
        if (event.getDiscountType() == DiscountType.PERCENT) {
            return Math.max(originalPrice * (1 - value / 100.0), 0);
        } else if (event.getDiscountType() == DiscountType.AMOUNT) {
            return Math.max(originalPrice - value, 0);
        }
        return originalPrice;
    }


    public double calculateDiscountedPrice(Course course) {
        double originalPrice = course.getPrice();
        LocalDate today = LocalDate.now();

        // 1. Ưu tiên sự kiện giảm giá riêng cho khóa học
        List<DiscountEvent> courseEvents = discountEventRepository
                .findByCourse_CourseIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        course.getCourseId(), today, today
                );

        for (DiscountEvent event : courseEvents) {
            if (event.getTargetType() == TargetType.PRODUCT) {
                return applyDiscount(originalPrice, event);
            }
        }

        // 2. Nếu không có sự kiện riêng => tìm sự kiện targetType = ALL
        List<DiscountEvent> globalEvents = discountEventRepository
                .findByStartDateLessThanEqualAndEndDateGreaterThanEqual(today, today);

        for (DiscountEvent event : globalEvents) {
            if (event.getTargetType() == TargetType.ALL) {
                return applyDiscount(originalPrice, event);
            }
        }

        // 3. Không có sự kiện giảm giá
        return originalPrice;
    }


    @Transactional
    public void handlePlaceOrder(List<Long> cartItemIds) {
        User user = getCurrentAuthenticatedUser(); // bạn đã có sẵn hàm này rồi
        if (user == null) return;

        Cart cart = cartRepository.findByUser(user);
        if (cart == null) return;

        List<CartItem> cartItems = new ArrayList<>();
        for (long cartItemId : cartItemIds) {
            cartItemRepository.findById(cartItemId).ifPresent(cartItems::add);
        }

        if (cartItems.isEmpty()) return;

        Order order = new Order();
        order.setUser(user);
        order.setCreatedAt(LocalDateTime.now());

        double totalPrice = 0;

        for (CartItem cartItem : cartItems) {
            Course course = cartItem.getCourse();
//            double originalPrice = course.getPrice();
            double finalPrice = calculateDiscountedPrice(course);

            totalPrice += finalPrice;

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setCourse(course);
            orderItem.setPrice(finalPrice); // đã có giảm giá
            order.getOrderItems().add(orderItem);
        }

        order.setTotalPrice(totalPrice);
        orderRepository.save(order);
//        List<Enrollment> enrollments = new ArrayList<>();
        for (OrderItem o : order.getOrderItems()) {
            Enrollment e = new Enrollment();
            e.setCourse(o.getCourse());
            e.setUser(o.getOrder().getUser());
            e.setProgress((float) 0);
            e.setEnrolledAt(order.getCreatedAt());
            enrollmentRepository.save(e);
        }

        // Xoá các CartItem sau khi đặt hàng
        for (CartItem cartItem : cartItems) {
            cartItemRepository.deleteById(cartItem.getId());
            cart.setSum(cart.getSum() - 1);
        }

        if (cart.getSum() <= 0) {
            cartRepository.deleteCartItemsByCartId(cart.getId());
        }
    }

}
