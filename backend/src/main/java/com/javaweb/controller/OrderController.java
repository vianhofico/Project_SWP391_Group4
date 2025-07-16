package com.javaweb.controller;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dtos.response.CourseSummaryDTO;
import com.javaweb.dtos.response.OrderDTO;
import com.javaweb.dtos.response.OrderItemDTO;
import com.javaweb.entities.Order;
import com.javaweb.entities.User;
import com.javaweb.services.impl.OrderServiceImpl;
import com.javaweb.services.impl.UserServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@PreAuthorize("hasRole('LEARNER')")
//@PreAuthorize("hasRole('USER')")
@RestController
@RequestMapping("/api")
public class OrderController {

    private final OrderServiceImpl orderServiceImpl;
    private final UserServiceImpl userServiceImpl;
    private final DTOConverter dTOConverter;

    public OrderController(OrderServiceImpl orderServiceImpl, UserServiceImpl userServiceImpl, DTOConverter dTOConverter) {
        this.orderServiceImpl = orderServiceImpl;
        this.userServiceImpl = userServiceImpl;
        this.dTOConverter = dTOConverter;
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

    @GetMapping("last-order-id")
    public ResponseEntity<Long> getIdOfLastOrder(){
        long lastId = orderServiceImpl.getIdOfLastOrder();
        return ResponseEntity.ok(lastId);
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<List<OrderItemDTO>> getOrderItems(@PathVariable long id) {
        Optional<Order> orderOpt = orderServiceImpl.getById(id);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<OrderItemDTO> dtos = orderOpt.get().getOrderItems().stream().map(item -> {
            OrderItemDTO dto = new OrderItemDTO();
            dto.setOrderItemId(item.getOrderItemId());
            dto.setPrice(item.getPrice().longValue());

            // Map course → CourseSummaryDTO
            CourseSummaryDTO courseDTO = new CourseSummaryDTO();
            courseDTO.setCourseId(item.getCourse().getCourseId());
            courseDTO.setTitle(item.getCourse().getTitle());
            courseDTO.setPrice(item.getCourse().getPrice());
            courseDTO.setImageUrl(item.getCourse().getImageUrl());

            dto.setCourse(courseDTO);
            return dto;
        }).toList();

        return ResponseEntity.ok(dtos);
    }



    @GetMapping("/order-history")
    public ResponseEntity<List<OrderDTO>> getOrderHistory(){
        User user = getCurrentAuthenticatedUser();
        List<OrderDTO> orderDTOS = new ArrayList<>();
        for(Order o : user.getOrders()){
            orderDTOS.add(dTOConverter.toOrderDTO(o));
        }
        return ResponseEntity.ok(orderDTOS);
//        return ResponseEntity.ok(user.getOrders());

    }

}
