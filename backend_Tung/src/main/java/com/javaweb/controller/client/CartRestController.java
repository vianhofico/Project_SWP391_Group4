package com.javaweb.controller.client;

import com.javaweb.entities.Cart;
import com.javaweb.entities.CartItem;
import com.javaweb.entities.Course;
import com.javaweb.entities.User;
//import com.javaweb.entities.dto.response.CourseDTO;
import com.javaweb.repository.CartItemRepository;
import com.javaweb.service.impl.CourseServiceImpl;
import com.javaweb.service.impl.UserServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.*;

@RestController
@RequestMapping("/api")
public class CartRestController {
    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserServiceImpl userServiceImpl;

    @Autowired
    private CourseServiceImpl courseServiceImpl;

    @GetMapping("/home")
    public ResponseEntity<List<Course>> getAllCourses() {
//    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        List<Course> courseDTOList = this.courseServiceImpl.getAllCourses();
//        List<CourseDTO> courseDTOList = this.courseService.getAllCourses();

        for (Course course : courseDTOList) {
//        for (CourseDTO courseDTO : courseDTOList) {

            // Tạo URL đầy đủ: http://localhost:8080/img/java-course.png
            String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/images/")
                    .path(course.getImageUrl())
//                    .path(courseDTO.getImage())
                    .toUriString();

            course.setImageUrl(imageUrl);
//            courseDTO.setImage(imageUrl);
        }

        return ResponseEntity.ok(courseDTOList);
    }


    @GetMapping("/cart")
    public ResponseEntity<List<CartItem>> getCart(HttpServletRequest request) {
        // Tạm thời lấy user cố định, sau này thay bằng session
        User user = userServiceImpl.getUserById(1L);
        Cart cart = courseServiceImpl.fetchByUser(user);
        List<CartItem> cartItems = cart != null ? cart.getCartItems() : new ArrayList<>();
        return ResponseEntity.ok(cartItems);
    }

    @GetMapping("/cartPrice")
    public ResponseEntity<Double> getPrice(HttpServletRequest request) {
        // Tạm thời lấy user cố định, sau này thay bằng session
        User user = userServiceImpl.getUserById(1L);
        Cart cart = courseServiceImpl.fetchByUser(user);
        List<CartItem> cartItems = cart != null ? cart.getCartItems() : new ArrayList<>();
        double totalPrice = cartItems.stream().mapToDouble(CartItem::getPrice).sum();
        return ResponseEntity.ok(totalPrice);
    }

    @PostMapping("/add-course-to-cart/{id}")
    public ResponseEntity<Void> addCourseToCart(@PathVariable long id, HttpServletRequest request) {
        HttpSession session = request.getSession(false);
//        String email = (String) session.getAttribute("email");
        long courseId = id;
        this.courseServiceImpl.handleAddCourseToCart("user@gmail.com",
                id
//                ,session
                , session
        ); // fake command
//        this.courseDTOService.handleAddCourseToCart(email, courseId, session); real command
        return ResponseEntity.ok().build();
    }

    // API xoá sản phẩm khỏi giỏ hàng
    @DeleteMapping("/delete-cart-course/{id}")
    public ResponseEntity<Void> deleteCartItem(@PathVariable("id") long id, HttpSession session) {
        courseServiceImpl.handleRemoveCartItem(id, session);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/confirm-checkout")
    public ResponseEntity<List<CartItem>> confirmCheckout(@RequestBody List<Long> cartItemIds) {
        List<CartItem> selectedCartItems = new ArrayList<>();
        double totalPrice = 0;

        for (Long cartItemId : cartItemIds) {
            Optional<CartItem> optionalCartItem = cartItemRepository.findById(cartItemId);
            if (optionalCartItem.isPresent()) {
                CartItem cartItem = optionalCartItem.get();
                selectedCartItems.add(cartItem);
                totalPrice += cartItem.getPrice();
            } else {
                // Optional: có thể log ra hoặc xử lý nếu item không tồn tại
                System.out.println("Không tìm thấy CartItem với ID: " + cartItemId);
            }
        }

        return ResponseEntity.ok(selectedCartItems);
    }

    @PostMapping("/place-order")
    public ResponseEntity<Void> handlePlaceOrder(
            HttpServletRequest request,
            @RequestBody List<Long> cartItemIds
    ) {
        HttpSession session = request.getSession(false);
        User currentUser = this.userServiceImpl.getUserByEmail("user@gmail.com");
        currentUser.setUserId(1l);

        this.courseServiceImpl.handlePlaceOrder(currentUser,
                session,
                cartItemIds);
//        this.courseDTOService.handlePlaceOrder(currentUser, session);

        return ResponseEntity.ok().build(); // status 200 (safe hơn cho frontend)

    }


}
