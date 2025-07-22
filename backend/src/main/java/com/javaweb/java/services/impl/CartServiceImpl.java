package com.javaweb.java.services.impl;


import com.javaweb.java.entities.Cart;
import com.javaweb.java.exceptions.ResourceNotFoundException;
import com.javaweb.java.converter.DTOConverter;
import com.javaweb.java.dtos.response.CartDTO;
import com.javaweb.java.repositories.CartRepository;
import com.javaweb.java.services.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final DTOConverter dtoConverter;

    @Override
    public CartDTO getCart(Long userId) {
        Cart cart = cartRepository.findByUserUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cart của người dùng với id: " + userId));
        return dtoConverter.toCartDTO(cart);
    }
}
