// package com.javaweb.controller.client;


// import com.javaweb.entity.Order;
// import com.javaweb.entity.OrderItem;
// import com.javaweb.entity.User;
// import com.javaweb.service.OrderService;
// import com.javaweb.service.UserService;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpSession;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import java.util.List;
// import java.util.Optional;

// @RestController
// @RequestMapping("/api")
// public class OrderController {

//     private final UserService userService;
//     private final OrderService orderService;

//     public OrderController(UserService userService, OrderService orderService) {
//         this.userService = userService;
//         this.orderService = orderService;
//     }

//     @GetMapping("/order-history")
//     public ResponseEntity<List<Order>> getOrderHistoryPage(HttpServletRequest request) {
// //        HttpSession session = request.getSession(false);
// //        String email = session.getAttribute("email").toString();
//         User user = userService.getUserByEmail("user@gmail.com");

// //        User user = this.userService.getUserById(1l);
//         List<Order> orders = user.getOrders();

//         return ResponseEntity.ok(orders);
//     }

//     @GetMapping("/order-items/{id}")
//     public ResponseEntity<List<OrderItem>> getOrderItem(@PathVariable("id") long id) {

//         Optional<Order> orderOptional = this.orderService.getById(id);
//         if(orderOptional.isPresent()) {
//             Order order = orderOptional.get();
//             List<OrderItem> orderItems = order.getOrderItems();
//             return ResponseEntity.ok(orderItems);
//         }
//         return ResponseEntity.notFound().build();
//     }

// }
package com.javaweb.controller.client;


import com.javaweb.entities.Order;
import com.javaweb.entities.OrderItem;
import com.javaweb.entities.User;
import com.javaweb.services.impl.OrderServiceImpl;
import com.javaweb.services.impl.UserServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class OrderController {

    private final OrderServiceImpl orderServiceImpl;
    private final UserServiceImpl userServiceImpl;

    public OrderController(OrderServiceImpl orderServiceImpl, UserServiceImpl userServiceImpl) {
        this.orderServiceImpl = orderServiceImpl;
        this.userServiceImpl = userServiceImpl;
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
                return userServiceImpl.getUserByEmail(email);
            }
        }
        return null;
    }

    @GetMapping("last-order-id")
    public ResponseEntity<Long> getIdOfLastOrder(){
        long lastId = orderServiceImpl.getIdOfLastOrder();
        return ResponseEntity.ok(lastId);
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<List<OrderItem>> getOrderItems(@PathVariable long id){
        Optional<Order> order = orderServiceImpl.getById(id);
        if(order.isPresent()){
            List<OrderItem> orderItems = order.get().getOrderItems();
            return ResponseEntity.ok(orderItems);
        }
        return ResponseEntity.notFound().build();
    }


    @GetMapping("/order-history")
    public ResponseEntity<List<Order>> getOrderHistory(){
//        User user = this.userServiceImpl.getUserByEmail("user@gmail.com");
        User user = getCurrentAuthenticatedUser();
        return ResponseEntity.ok(user.getOrders());

    }

}
