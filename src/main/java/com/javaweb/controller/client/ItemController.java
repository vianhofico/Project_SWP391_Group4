package com.javaweb.controller.client;

import com.javaweb.entity.Cart;
import com.javaweb.entity.CartItem;
import com.javaweb.entity.User;
import com.javaweb.service.CourseDTOService;
import com.javaweb.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
public class ItemController {

    private final CourseDTOService courseDTOService;
    private final UserService userService;
    public ItemController(CourseDTOService courseDTOService, UserService userService) {
        this.courseDTOService = courseDTOService;
        this.userService = userService;
    }


    @PostMapping("/add-course-to-cart/{id}")
    public String addCourseToCart(@PathVariable long id, HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        String email = (String) session.getAttribute("email");
        long courseId = id;
        this.courseDTOService.handleAddCourseToCart("user@gmail.com", 1l, session); // fake command
//        this.courseDTOService.handleAddCourseToCart(email, courseId, session); real command
        return "redirect:/";
    }

    @GetMapping("/cart")
    public String getCartPage(Model model, HttpServletRequest request){
        HttpSession session = request.getSession(false);
        long id = 1;
//        long id = (long) session.getAttribute("id");
//        user.setUserId(id);
        User user = this.userService.getUserById(1);
        Cart cart = this.courseDTOService.fetchByUser(user);
        session.setAttribute("fullName", user.getFullName());
        List<CartItem> cartItems = cart == null ? new ArrayList<>() : cart.getCartItems();
        double totalPrice = 0;
        for(CartItem ct : cartItems){
            totalPrice += ct.getPrice();
        }

        model.addAttribute("totalPrice", totalPrice);
        model.addAttribute("cartItems", cartItems);
        model.addAttribute("cart", cart);
        return "client/cart/show";
    }

    @PostMapping("/delete-cart-course/{id}")
    public String deleteCartDetail(@PathVariable long id, HttpServletRequest request){
        HttpSession session = request.getSession(false);
        long cartItemId = id;
        this.courseDTOService.handleRemoveCartItem(cartItemId, session); 
        return "redirect:/cart";
    }

    @GetMapping("/checkout")
    public String getCheckOutPage(Model model, HttpServletRequest request) {
//        User currentUser = new User();// null
        User currentUser = this.userService.getUserByEmail("user@gmail.com");
        HttpSession session = request.getSession(false);
//        long id = (long) session.getAttribute("id");
        long id = 1;
        currentUser.setUserId(id);

        Cart cart = this.courseDTOService.fetchByUser(currentUser);

        List<CartItem> cartItems = cart == null ? new ArrayList<CartItem>() : cart.getCartItems();

        double totalPrice = 0;
        for (CartItem cd : cartItems) {
            totalPrice += cd.getPrice();
        }

        model.addAttribute("cartItems", cartItems);
        model.addAttribute("totalPrice", totalPrice);

        return "client/cart/checkout";
    }

    @PostMapping("/confirm-checkout")
    public String getConfirmCheckoutPage(@ModelAttribute("cart") Cart cart) {
        List<CartItem> cartDetails = cart == null ? new ArrayList<>(null) : cart.getCartItems();
        this.courseDTOService.handleUpdateCartBeforeCheckout(cartDetails);

        return "redirect:/checkout";
    }

    @PostMapping("/place-order")
    public String handlePlaceOrder(
            HttpServletRequest request,
            @RequestParam("receiverName") String receiverName,
            @RequestParam("receiverAddress") String receiverAddress,
            @RequestParam("receiverPhone") String receiverPhone
            ) {
        HttpSession session = request.getSession(false);
//        User currentUser = new User();// null
        User currentUser = this.userService.getUserByEmail("user@gmail.com");// null
//        long id = (long) session.getAttribute("id");
        currentUser.setUserId(1l);

        this.courseDTOService.handlePlaceOrder(currentUser, session, receiverName, receiverAddress, receiverPhone);
//        this.courseDTOService.handlePlaceOrder(currentUser, session);


        return "client/cart/thanks";
    }

}
