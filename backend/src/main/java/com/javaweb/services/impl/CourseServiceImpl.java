//package com.javaweb.service.impl;
//
//import com.javaweb.entities.*;
////import com.javaweb.entities.dto.response.CourseDTO;
//import com.javaweb.enums.DiscountType;
//import com.javaweb.repository.*;
//import com.javaweb.service.CourseService;
//import jakarta.servlet.http.HttpSession;
//import jakarta.transaction.Transactional;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDate;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Optional;
//
//@Service
//public class CourseServiceImpl implements CourseService {
//    private final CartItemRepository cartItemRepository;
//    private final UserServiceImpl userServiceImpl;
//    private final CartRepository cartRepository;
//    private final CourseRepository courseRepository;
//    private final OrderRepository orderRepository;
//    private final OrderItemRepository orderItemRepository;
//    private final DiscountEventRepository discountEventRepository;
//
//    public CourseServiceImpl(CartItemRepository cartItemRepository, UserServiceImpl userServiceImpl, CartRepository cartRepository, CourseRepository courseRepository, OrderRepository orderRepository, OrderItemRepository orderItemRepository, DiscountEventRepository discountEventRepository) {
//        this.cartItemRepository = cartItemRepository;
//        this.userServiceImpl = userServiceImpl;
//        this.cartRepository = cartRepository;
//        this.courseRepository = courseRepository;
//        this.orderRepository = orderRepository;
//        this.orderItemRepository = orderItemRepository;
//        this.discountEventRepository = discountEventRepository;
//    }
//
//    public List<Course> getAllCourses() {
//        return this.courseRepository.findAll();
//    }
//
//    public Cart fetchByUser(User user) {
//        return this.cartRepository.findByUser(user);
//    }
//
//
//    public void handleAddCourseToCart(String email, long courseId, HttpSession session) {
//        User user = this.userServiceImpl.getUserByEmail(email);
//
//        if (user != null) {
//            // Tìm hoặc tạo mới giỏ hàng
//            Cart cart = this.cartRepository.findByUser(user);
//            if (cart == null) {
//                cart = new Cart();
//                cart.setUser(user);
//                cart.setSum(0);
//                cart = this.cartRepository.save(cart);
//            }
//
//            // Tìm course
//            Optional<Course> courseDTOOptional = this.courseRepository.findById(courseId);
//            if (courseDTOOptional.isPresent()) {
//                Course course = courseDTOOptional.get();
//                double originalPrice = course.getPrice();
//                double finalPrice = originalPrice;
//
//                // === Gọi repository có sẵn để lấy các event giảm giá đang hoạt động
//                LocalDate today = LocalDate.now();
//                List<DiscountEvent> activeEvents = this.discountEventRepository
//                        .findByCourse_CourseIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
//                                courseId, today, today
//                        );
//
//                DiscountEvent activeDiscount = activeEvents.isEmpty() ? null : activeEvents.get(0); // ưu tiên 1 event đầu tiên
//
//                // Tính giá sau giảm
//                if (activeDiscount != null) {
//                    if (activeDiscount.getDiscountType() == DiscountType.PERCENT) {
//                        finalPrice = originalPrice * (1 - activeDiscount.getDiscountValue() / 100.0);
//                    } else {
//                        finalPrice = Math.max(originalPrice - activeDiscount.getDiscountValue(), 0);
//                    }
//                }
//
//                // Kiểm tra sản phẩm đã tồn tại trong giỏ chưa
//                CartItem existingItem = this.cartItemRepository.findByCartAndCourse(cart, course);
////            CartItem existingItem = this.cartItemRepository.findByCartAndCourse(cart, courseDTO);
//                if (existingItem == null) {
//                    CartItem newItem = new CartItem();
//                    newItem.setCart(cart);
//                    newItem.setCourse(course);
////                newItem.setCourseDTO(courseDTO);
//                    newItem.setPrice(finalPrice);
////                newItem.setOriginalPrice(originalPrice);
////                newItem.setDiscountName(activeDiscount != null ? activeDiscount.getName() : null);
//                    this.cartItemRepository.save(newItem);
//
//                    cart.setSum(cart.getSum() + 1);
//                    this.cartRepository.save(cart);
//                } else {
//                    // Nếu muốn cập nhật lại giá (khi có thay đổi sự kiện giảm giá)
//                    existingItem.setPrice(finalPrice);
////                existingItem.setOriginalPrice(originalPrice);
////                existingItem.setDiscountName(activeDiscount != null ? activeDiscount.getName() : null);
//                    this.cartItemRepository.save(existingItem);
//                }
//            }
//        }
//    }
//
//
//    @Transactional
//    public void handleRemoveCartItem(long id, HttpSession session) {
//        Optional<CartItem> cartItemOptional = this.cartItemRepository.findById(id);
//        if (cartItemOptional.isPresent()) {
//            CartItem cartItem = cartItemOptional.get();
//
////            Cart cart = cartItem.getCart();
//            Cart cart = this.cartRepository.findByUser(this.userServiceImpl.getUserById(1l));
//            // delete cartItem
//            this.cartItemRepository.deleteById(id);
//
//            int cartSum = cart.getSum();
//            if (cartSum > 1) {
//                cart.setSum(cartSum - 1);
//                session.setAttribute("sum", cart.getSum());
//                this.cartRepository.save(cart);
//            } else {
////                this.cartRepository.deleteById(cart.getId());
//                cartRepository.deleteCartItemsByCartId(cart.getId());
//                session.setAttribute("sum", 0);
//            }
//        }
//    }
//
//    @Transactional
//    public void handlePlaceOrder(
//            User user,
//            HttpSession session,
//            List<Long> cartItemIds) {
//
//        Cart cart = this.cartRepository.findByUser(user);
//        if (cart != null) {
//            List<CartItem> cartItems = new ArrayList<>();
//            for (long cartId : cartItemIds) {
//                cartItems.add(this.cartItemRepository.findById(cartId).get());
//            }
//
//            if (cartItems != null) {
//                //create order
//                Order order = new Order();
//                order.setUser(user);
////                order.setReceiverName(receiverName);
////                order.setReceiverAddress(receiverAddress);
////                order.setReceiverPhone(receiverPhone);
//                order.setStatus("COMPLETED");
//
//                double sum = 0;
//                for (CartItem ct : cartItems) {
//                    sum += ct.getPrice();
//                }
//                order.setCreatedAt(order.getCreatedAt());
//                order.setTotalPrice(sum);
//                order = this.orderRepository.save(order);
//
//                // create orderItem
//
//                for (long c : cartItemIds) {
//                    CartItem cartItem = cartItemRepository.findById(c).get();
//                    OrderItem orderItem = new OrderItem();
//                    orderItem.setOrder(order);
//                    orderItem.setCourse(cartItem.getCourse());
////                    orderItem.setCourse(cartItem.getCourse());
////                    orderItem.setCourse(cartItem.getCourseDTO());
//                    orderItem.setPrice(cartItem.getPrice());
//                    this.orderItemRepository.save(orderItem);
//                }
//
////                for (CartItem ct : cartItems) {
////                    this.cartItemRepository.deleteById(ct.getId());
////                }
//
//                for (long c : cartItemIds) {
//                    this.cartItemRepository.deleteById(c);
//                    cart.setSum(cart.getSum() - 1);
//                }
//
//                if (cart.getSum() == 0) {
//                    cartRepository.deleteCartItemsByCartId(cart.getId());
//                }
//
//
////                session.setAttribute("sum", cart.getSum());
//            }
//        }
//
//    }
//
//
//}

package com.javaweb.services.impl;

import com.javaweb.entities.*;
import com.javaweb.enums.DiscountType;
import com.javaweb.repositories.*;
import com.javaweb.services.CourseService;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CourseServiceImpl implements CourseService {
    private final CartItemRepository cartItemRepository;
    private final UserServiceImpl userServiceImpl;
    private final CartRepository cartRepository;
    private final CourseRepository courseRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final DiscountEventRepository discountEventRepository;

    public CourseServiceImpl(
            CartItemRepository cartItemRepository,
            UserServiceImpl userServiceImpl,
            CartRepository cartRepository,
            CourseRepository courseRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            DiscountEventRepository discountEventRepository) {
        this.cartItemRepository = cartItemRepository;
        this.userServiceImpl = userServiceImpl;
        this.cartRepository = cartRepository;
        this.courseRepository = courseRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.discountEventRepository = discountEventRepository;
    }

    public List<Course> getAllCourses() {
        return this.courseRepository.findAll();
    }

    public Cart fetchByUser(User user) {
        return this.cartRepository.findByUser(user);
    }

    // ✅ Lấy User hiện đang đăng nhập
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
                return userServiceImpl.getUserByEmail(email);
            }
        }
        return null;
    }

    public void handleAddCourseToCart(long courseId, HttpSession session) {
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
    public void handleRemoveCartItem(long id, HttpSession session) {
        Optional<CartItem> cartItemOptional = this.cartItemRepository.findById(id);
        if (cartItemOptional.isPresent()) {
            User user = getCurrentAuthenticatedUser();
            if (user == null) return;

            Cart cart = this.cartRepository.findByUser(user);
            this.cartItemRepository.deleteById(id);

            int cartSum = cart.getSum();
            if (cartSum > 1) {
                cart.setSum(cartSum - 1);
                session.setAttribute("sum", cart.getSum());
                this.cartRepository.save(cart);
            } else {
                cartRepository.deleteCartItemsByCartId(cart.getId());
                session.setAttribute("sum", 0);
            }
        }
    }

    @Transactional
    public void handlePlaceOrder(HttpSession session, List<Long> cartItemIds) {
        User user = getCurrentAuthenticatedUser();
        if (user == null) return;

        Cart cart = this.cartRepository.findByUser(user);
        if (cart != null) {
            List<CartItem> cartItems = new ArrayList<>();
            for (long cartId : cartItemIds) {
                cartItemRepository.findById(cartId).ifPresent(cartItems::add);
            }

            if (!cartItems.isEmpty()) {
                Order order = new Order();
                order.setUser(user);
                order.setStatus("COMPLETED");

                double sum = cartItems.stream().mapToDouble(CartItem::getPrice).sum();
                order.setTotalPrice(sum);
                order = this.orderRepository.save(order);

                for (CartItem cartItem : cartItems) {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);
                    orderItem.setCourse(cartItem.getCourse());
                    orderItem.setPrice(cartItem.getPrice());
                    this.orderItemRepository.save(orderItem);
                }

                for (CartItem cartItem : cartItems) {
                    this.cartItemRepository.deleteById(cartItem.getId());
                    cart.setSum(cart.getSum() - 1);
                }

                if (cart.getSum() == 0) {
                    cartRepository.deleteCartItemsByCartId(cart.getId());
                }

//                session.setAttribute("sum", cart.getSum());
            }
        }
    }
}
