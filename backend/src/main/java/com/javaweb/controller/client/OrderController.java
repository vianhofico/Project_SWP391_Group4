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

//
//import com.javaweb.entity.Order;
//import com.javaweb.service.OrderService;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/api")
//public class OrderController {
//
//    private final OrderService orderService;
//
//    public OrderController(OrderService orderService) {
//        this.orderService = orderService;
//    }
//
//    @GetMapping("last-order-id")
//    public ResponseEntity<Long> getIdOfLastOrder(){
//        long lastId = orderService.getIdOfLastOrder();
//        return ResponseEntity.ok(lastId);
//    }
//
//}

import com.javaweb.entity.Order;
import com.javaweb.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("last-order-id")
    public ResponseEntity<Long> getIdOfLastOrder(){
        long lastId = orderService.getIdOfLastOrder();
        return ResponseEntity.ok(lastId);
    }

}

