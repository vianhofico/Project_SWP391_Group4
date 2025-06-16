package com.javaweb.controller.client;

import com.javaweb.entity.Cart;
import com.javaweb.entity.CartItem;
import com.javaweb.entity.User;
import com.javaweb.entity.dto.CourseDTO;
import com.javaweb.repository.CartItemRepository;
import com.javaweb.service.CourseDTOService;
import com.javaweb.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class CartRestController {
    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CourseDTOService courseDTOService;


    @GetMapping("/home")
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        List<CourseDTO> courseDTOList = this.courseDTOService.getAllCourses();
        return ResponseEntity.ok(courseDTOList);
    }

    @GetMapping("/cart")
    public ResponseEntity<List<CartItem>> getCart(HttpServletRequest request) {
        // Tạm thời lấy user cố định, sau này thay bằng session
        User user = userService.getUserById(1L);
        Cart cart = courseDTOService.fetchByUser(user);
        List<CartItem> cartItems = cart != null ? cart.getCartItems() : new ArrayList<>();
        return ResponseEntity.ok(cartItems);
    }

    @GetMapping("/cartPrice")
    public ResponseEntity<Double> getPrice(HttpServletRequest request) {
        // Tạm thời lấy user cố định, sau này thay bằng session
        User user = userService.getUserById(1L);
        Cart cart = courseDTOService.fetchByUser(user);
        List<CartItem> cartItems = cart != null ? cart.getCartItems() : new ArrayList<>();
        double totalPrice = cartItems.stream().mapToDouble(CartItem::getPrice).sum();
        return ResponseEntity.ok(totalPrice);
    }

    @PostMapping("/add-course-to-cart/{id}")
    public ResponseEntity<Void> addCourseToCart(@PathVariable long id, HttpServletRequest request) {
        HttpSession session = request.getSession(false);
//        String email = (String) session.getAttribute("email");
        long courseId = id;
        this.courseDTOService.handleAddCourseToCart("user@gmail.com",
                id
<<<<<<< HEAD:backend/src/main/java/com/javaweb/controller/client/CartRestController.java
//                ,session
=======
                ,session
>>>>>>> 4a8d9ff32eb9520727c8f06de377ebfbc1d08484:src/main/java/com/javaweb/controller/client/CartRestController.java
        ); // fake command
//        this.courseDTOService.handleAddCourseToCart(email, courseId, session); real command
        return ResponseEntity.ok().build();
    }

    // API xoá sản phẩm khỏi giỏ hàng
    @DeleteMapping("/delete-cart-course/{id}")
    public ResponseEntity<Void> deleteCartItem(@PathVariable("id") long id, HttpSession session) {
        courseDTOService.handleRemoveCartItem(id, session);
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
        User currentUser = this.userService.getUserByEmail("user@gmail.com");
        currentUser.setUserId(1l);

        this.courseDTOService.handlePlaceOrder(currentUser,
                session,
                cartItemIds);
<<<<<<< HEAD:backend/src/main/java/com/javaweb/controller/client/CartRestController.java
//        this.courseDTOService.handlePlaceOrder(currentUser, session);
=======
>>>>>>> 4a8d9ff32eb9520727c8f06de377ebfbc1d08484:src/main/java/com/javaweb/controller/client/CartRestController.java

        return ResponseEntity.ok().build(); // status 200 (safe hơn cho frontend)

    }




}
