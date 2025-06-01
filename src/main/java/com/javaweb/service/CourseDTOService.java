package com.javaweb.service;

import com.javaweb.entity.*;
import com.javaweb.entity.dto.CourseDTO;
import com.javaweb.repository.*;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseDTOService {
    private final CartItemRepository cartItemRepository;
    private final UserService userService;
    private final CartRepository cartRepository;
    private final CourseRepository courseRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public CourseDTOService(CartItemRepository cartItemRepository, UserService userService, CartRepository cartRepository, CourseRepository courseRepository, OrderRepository orderRepository, OrderItemRepository orderItemRepository) {
        this.cartItemRepository = cartItemRepository;
        this.userService = userService;
        this.cartRepository = cartRepository;
        this.courseRepository = courseRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    public List<CourseDTO> getAllCourses() {
        return this.courseRepository.findAll();
    }

    public Cart fetchByUser(User user){
        return this.cartRepository.findByUser(user);
    }

    public void handleAddCourseToCart(String email, long courseId, HttpSession session) {
        User user = this.userService.getUserByEmail(email);

        if (user != null) {
            // check User da co Cart chua ? neu chua -> tao moi
            Cart cart = this.cartRepository.findByUser(user);
            if (cart == null) {
                // tao moi cart
                Cart otherCart = new Cart();
                otherCart.setUser(user);
                otherCart.setSum(0);
                cart = this.cartRepository.save(otherCart);
            }

            // luu cart_detail
            // tim product bang id
            Optional<CourseDTO> courseDTOOptional = this.courseRepository.findById(courseId);
            if (courseDTOOptional.isPresent()) {
                CourseDTO courseDTO = courseDTOOptional.get();
                //Check san pham da tung duoc them vao gio hang truoc day chua
                CartItem oldDetail = this.cartItemRepository.findByCartAndCourse(cart, courseDTO);
                //
                if (oldDetail == null) {
                    CartItem ct = new CartItem();
                    ct.setCart(cart);
                    ct.setCourseDTO(courseDTO);
                    ct.setPrice(ct.getPrice());
//                    ct.setQuantity(quantity);
                    this.cartItemRepository.save(ct);

                    // update ct(sum)
                    int s = cart.getSum() + 1;
                    cart.setSum(s);
                    this.cartRepository.save(cart);
                    session.setAttribute("sum", s);
                } else {
//                    oldDetail.setQuantity(oldDetail.getQuantity() + quantity);
                    this.cartItemRepository.save(oldDetail);
                }
            }
        }
    }

    public void handleRemoveCartItem(long id, HttpSession session) {
        Optional<CartItem> cartItemOptional = this.cartItemRepository.findById(id);
        if (cartItemOptional.isPresent()) {
            CartItem cartItem = cartItemOptional.get();

//            Cart cart = cartItem.getCart();
            Cart cart = this.cartRepository.findByUser(this.userService.getUserById(1l));
            // delete cartItem
            this.cartItemRepository.deleteById(id);

            int cartSum = cart.getSum();
            if (cartSum > 1) {
                cart.setSum(cartSum - 1);
                session.setAttribute("sum", cart.getSum());
                this.cartRepository.save(cart);
            } else {
//                this.cartRepository.deleteById(cart.getId());
                this.cartRepository.deleteById(1l);
                session.setAttribute("sum", 0);
            }
        }
    }
    
    public void handleUpdateCartBeforeCheckout(List<CartItem> cartItems) {
        for (CartItem cartItem : cartItems) {
            Optional<CartItem> cdOptional = this.cartItemRepository.findById(cartItem.getId());
            if (cdOptional.isPresent()) {
                CartItem currentCartItem = cdOptional.get();
//                currentCartItem.setQuantity(cartItem.getQuantity());
                this.cartItemRepository.save(currentCartItem);
            }
        }

    }

    @Transactional
    public void handlePlaceOrder(
            User user, HttpSession session
            ,String receiverName, String receiverAddress, String receiverPhone
            ) {

        Cart cart = this.cartRepository.findByUser(user);
        if (cart != null) {
            List<CartItem> cartItems = cart.getCartItems();

            if (cartItems != null) {
                //create order
                Order order = new Order();
                order.setUser(user);
//                order.setReceiverName(receiverName);
//                order.setReceiverAddress(receiverAddress);
//                order.setReceiverPhone(receiverPhone);
                order.setStatus("PENDING");

                double sum = 0;
                for (CartItem ct : cartItems) {
                    sum += ct.getPrice();
                }
                order.setTotalPrice(sum);
                order = this.orderRepository.save(order);

                // create orderItem
                for (CartItem ct : cartItems) {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);
//                    orderItem.setCourse(cd.getCourse());
                    orderItem.setCourse(ct.getCourseDTO());
                    orderItem.setPrice(ct.getPrice());

                    this.orderItemRepository.save(orderItem);
                }

                for (CartItem ct : cartItems) {
                    this.cartItemRepository.deleteById(ct.getId());
                }

                cartRepository.deleteCartItemsByCartId(cart.getId());


                session.setAttribute("sum", 0);
            }
        }

    }
    

}
