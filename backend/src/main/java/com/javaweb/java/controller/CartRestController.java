package com.javaweb.java.controller;

import com.javaweb.java.entities.*;
import com.javaweb.java.converter.DTOConverter;
import com.javaweb.java.dtos.response.CartItemDTO;
import com.javaweb.java.dtos.response.CourseSummaryDTO;
import com.javaweb.java.repositories.CartItemRepository;
import com.javaweb.java.repositories.CourseRepository;
import com.javaweb.java.services.OrderService;
import com.javaweb.java.services.impl.CourseServiceImpl;
import com.javaweb.java.services.impl.UserServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/api")
public class CartRestController {
    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserServiceImpl userServiceImpl;

    @Autowired
    private CourseServiceImpl courseServiceImpl;

    private final CourseRepository courseRepository;

    private final DTOConverter dtoConverter;
    private OrderService orderService;

    public CartRestController(CourseRepository courseRepository, DTOConverter dtoConverter) {
        this.courseRepository = courseRepository;
        this.dtoConverter = dtoConverter;
    }

    private User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            String email = principal instanceof UserDetails
                    ? ((UserDetails) principal).getUsername()
                    : (String) principal;

            if (email != null && !email.equals("anonymousUser")) {
                return userServiceImpl.getUserByEmail(email).get();
            }
        }
        return null;
    }

    @GetMapping("/home")
    public ResponseEntity<List<CourseSummaryDTO>> getAllCourses() {
        List<Course> courses = courseServiceImpl.getAllCourses();
        List<CourseSummaryDTO> dtos = courses.stream().map(course -> {
            CourseSummaryDTO dto = new CourseSummaryDTO();
            dto.setCourseId(course.getCourseId());
            dto.setTitle(course.getTitle());
            dto.setDescription(course.getDescription());
            dto.setPrice(course.getPrice());
            dto.setImageUrl(ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/images/")
                    .path(URLEncoder.encode(course.getImageUrl(), StandardCharsets.UTF_8))
                    .toUriString());
            return dto;
        }).toList();
        return ResponseEntity.ok(dtos);
    }

    //api lay id cua cac khoa hoc da mua boi user dang dang nhap
    @GetMapping("/purchased-courses")
    public ResponseEntity<List<Long>> getPurchasedCourses() {
        User user = getCurrentAuthenticatedUser();  // Hàm lấy user hiện tại
        List<Long> ids = new ArrayList<>();
        List<Order> orders = user.getOrders();
        for (Order order : orders) {
            List<OrderItem> orderItems = order.getOrderItems();
            for (OrderItem orderItem : orderItems) {
                ids.add(orderItem.getCourse().getCourseId());
            }
        }
        System.out.println("===> Course IDs: " + ids);
        return ResponseEntity.ok(ids);
    }

//    @GetMapping("/courses")
//    public ResponseEntity<List<CourseSummaryDTO>> getCoursesByIds() {
//        List<Long> ids = getPurchasedCourses().getBody();
//        List<Course> courses = new ArrayList<>();
//        for(Long id : ids) {
//            courses.add(courseRepository.findById(id).get());
//        }
//        List<CourseSummaryDTO> dtos = courses.stream().map(course -> {
//            CourseSummaryDTO dto = new CourseSummaryDTO();
//            dto.setCourseId(course.getCourseId());
//            dto.setTitle(course.getTitle());
//            dto.setPrice(course.getPrice());
//            dto.setImageUrl("http://localhost:8080/images/" +
//                    URLEncoder.encode(course.getImageUrl(), StandardCharsets.UTF_8));
//            return dto;
//        }).toList();
//        return ResponseEntity.ok(dtos);
//    }

    @GetMapping("/cart")
    public ResponseEntity<List<CartItemDTO>> getCart() {
        User user = getCurrentAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).build();

        Cart cart = courseServiceImpl.fetchByUser(user);
        List<CartItemDTO> dtos = new ArrayList<>();
        if (cart != null) {
            for (CartItem item : cart.getCartItems()) {
                Course course = item.getCourse();
                if (course == null) continue;

                CourseSummaryDTO courseDTO = new CourseSummaryDTO();
                courseDTO.setCourseId(course.getCourseId());
                courseDTO.setTitle(course.getTitle());
                courseDTO.setPrice(course.getPrice());
                courseDTO.setImageUrl(ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/images/")
                        .path(URLEncoder.encode(course.getImageUrl(), StandardCharsets.UTF_8))
                        .toUriString());

                CartItemDTO dto = new CartItemDTO();
                dto.setCartItemId(item.getId());
                dto.setPrice(item.getPrice());
                dto.setCourse(courseDTO);

                dtos.add(dto);
            }
        }
        return ResponseEntity.ok(dtos);
    }



    @GetMapping("/cartPrice")
    public ResponseEntity<Double> getCartTotalPrice() {
        User user = getCurrentAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).build();

        Cart cart = courseServiceImpl.fetchByUser(user);
        double total = cart != null
                ? cart.getCartItems().stream().mapToDouble(CartItem::getPrice).sum()
                : 0.0;
        return ResponseEntity.ok(total);
    }

    @PostMapping("/add-course-to-cart/{id}")
    public ResponseEntity<Void> addCourseToCart(@PathVariable Long id, HttpServletRequest request) {
        User user = getCurrentAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).build();

        courseServiceImpl.handleAddCourseToCart(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete-cart-course/{id}")
    public ResponseEntity<Void> deleteCartItem(@PathVariable Long id) {
        courseServiceImpl.handleRemoveCartItem(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/confirm-checkout")
    public ResponseEntity<List<CartItemDTO>> confirmCheckout(@RequestBody List<Long> cartItemIds) {
        User user = getCurrentAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).build();

        List<CartItemDTO> dtos = new ArrayList<>();
        for (Long id : cartItemIds) {
            cartItemRepository.findById(id).ifPresent(cartItem -> {
                Course course = cartItem.getCourse();
                if (course == null) return;

                CourseSummaryDTO courseDTO = new CourseSummaryDTO();
                courseDTO.setCourseId(course.getCourseId());
                courseDTO.setTitle(course.getTitle());
                courseDTO.setPrice(course.getPrice());
                courseDTO.setImageUrl(ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/images/")
                        .path(URLEncoder.encode(course.getImageUrl(), StandardCharsets.UTF_8))
                        .toUriString());

                CartItemDTO dto = new CartItemDTO();
                dto.setCartItemId(cartItem.getId());
                dto.setPrice(cartItem.getPrice());
                dto.setCourse(courseDTO);

                dtos.add(dto);
            });
        }

        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/place-order")
    public ResponseEntity<Void> handlePlaceOrder(@RequestBody List<Long> cartItemIds) {
        User user = getCurrentAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).build();

        courseServiceImpl.handlePlaceOrder(cartItemIds);
        return ResponseEntity.ok().build();
    }
}
