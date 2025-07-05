package com.javaweb.controller.client;

import com.javaweb.entities.*;
import com.javaweb.repositories.CartItemRepository;
import com.javaweb.services.impl.CourseServiceImpl;
import com.javaweb.services.impl.UserServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;

@Controller
public class ItemController {
    private final CartItemRepository cartItemRepository;
    private final CourseServiceImpl courseServiceImpl;
    private final UserServiceImpl userServiceImpl;
    public ItemController(CartItemRepository cartItemRepository, CourseServiceImpl courseServiceImpl, UserServiceImpl userServiceImpl) {
        this.cartItemRepository = cartItemRepository;
        this.courseServiceImpl = courseServiceImpl;
        this.userServiceImpl = userServiceImpl;
    }


    @GetMapping("/test-img")
    public ResponseEntity<Resource> testImage() throws IOException {
        Resource image = new ClassPathResource("static/images/c++.png");

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(image);
    }


    @PostMapping("/add-course-to-cart/{id}")
    public String addCourseToCart(@PathVariable long id, HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        String email = (String) session.getAttribute("email");
        long courseId = id;
        this.courseServiceImpl.handleAddCourseToCart(id, session); // fake command
//        this.courseServiceImpl.handleAddCourseToCart("user@gmail.com", id, session); // fake command
//        this.courseDTOService.handleAddCourseToCart(email, courseId, session); real command
        return "redirect:/";
    }


    @GetMapping("/cart")
    public String getCartPage(Model model, HttpServletRequest request){
        HttpSession session = request.getSession(false);
        long id = 1;
//        long id = (long) session.getAttribute("id");
//        user.setUserId(id);
        User user = this.userServiceImpl.getUserById(1);
        Cart cart = this.courseServiceImpl.fetchByUser(user);
        session.setAttribute("fullName", user.getFullName());
        List<CartItem> cartItems = cart == null ? new ArrayList<>() : cart.getCartItems();
        double totalPrice = 0;
        for(CartItem ci : cartItems){
            totalPrice += ci.getPrice();
        }

        model.addAttribute("totalPrice", totalPrice);
        model.addAttribute("cartItems", cartItems);
        model.addAttribute("cart", cart);
        return "client/cart/show";
    }

    @PostMapping("/delete-cart-course/{id}")
    public String deleteCartItem(@PathVariable long id, HttpServletRequest request){
        HttpSession session = request.getSession(false);
        long cartItemId = id;
        this.courseServiceImpl.handleRemoveCartItem(cartItemId, session);
        return "redirect:/cart";
    }

    @GetMapping("/checkout")
    public String getCheckOutPage(Model model, HttpServletRequest request) {
//        User currentUser = new User();// null
        User currentUser = this.userServiceImpl.getUserByEmail("user@gmail.com");
        HttpSession session = request.getSession(false);
//        long id = (long) session.getAttribute("id");
        long id = 1;
        currentUser.setUserId(id);

        Cart cart = this.courseServiceImpl.fetchByUser(currentUser);

        List<CartItem> cartItems = cart == null ? new ArrayList<CartItem>() : cart.getCartItems();

        double totalPrice = 0;
        for (CartItem cd : cartItems) {
            totalPrice += cd.getPrice();
        }

        model.addAttribute("cartItems", cartItems);
        model.addAttribute("totalPrice", totalPrice);

        return "client/cart/checkout";
    }


    @GetMapping("/confirm-checkout")
    public String confirmCheckout(@RequestParam("cartItemIds") List<Long> cartDetailIds,
                                  Model model) {

        // Lấy danh sách cart detail từ DB dựa theo id
        List<CartItem> selectedCartItems = new ArrayList<>();
        double totalPrice = 0;
        for(Long cartDetailId : cartDetailIds){
            Optional<CartItem> cd = cartItemRepository.findById(cartDetailId);
            selectedCartItems.add(cd.get());
            totalPrice += cd.get().getPrice();
        }

        model.addAttribute("cartItems", selectedCartItems);
        model.addAttribute("totalPrice", totalPrice);
        return "client/cart/checkout"; // -> /WEB-INF/views/checkout.jsp
    }

    @PostMapping("/place-order")
    public String handlePlaceOrder(
            HttpServletRequest request,
//            @RequestParam("receiverName") String receiverName,
//            @RequestParam("receiverAddress") String receiverAddress,
//            @RequestParam("receiverPhone") String receiverPhone,
            @RequestParam("cartItemIds") List<Long> cartItemIds
    ) {
        HttpSession session = request.getSession(false);
//        User currentUser = new User();// null
        User currentUser = this.userServiceImpl.getUserByEmail("user@gmail.com");// null
//        long id = (long) session.getAttribute("id");
        currentUser.setUserId(1l);

        this.courseServiceImpl.handlePlaceOrder(session, cartItemIds);
//        this.courseServiceImpl.handlePlaceOrder(currentUser, session, cartItemIds);
//        this.courseDTOService.handlePlaceOrder(currentUser, session);


        return "client/cart/thanks";
    }

    @GetMapping("/order-history")
    public String getOrderHistoryPage(Model model, HttpServletRequest request){
        User user = this.userServiceImpl.getUserById(1l);
        List<Order> orders = user.getOrders();
        model.addAttribute("orders", orders);
        return "client/cart/order-history";
    }

}
