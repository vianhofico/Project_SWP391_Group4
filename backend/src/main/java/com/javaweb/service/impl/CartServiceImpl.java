package com.javaweb.service.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dto.CartDTO;
import com.javaweb.entity.Cart;
import com.javaweb.repository.CartRepository;
import com.javaweb.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository; // Assuming you have a CartRepository to interact with the database
    private final DTOConverter dtoConverter;

    @Override
    public CartDTO getCart(Long userId) {
        Cart cart = cartRepository.findByUserUserId(userId);
        return dtoConverter.toCartDTO(cart);
    }
}
