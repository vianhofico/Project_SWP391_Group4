package com.javaweb.services.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dtos.response.admin.CartDTO;
import com.javaweb.entities.Cart;
import com.javaweb.exceptions.ResourceNotFoundException;
import com.javaweb.repositories.CartRepository;
import com.javaweb.services.CartService;
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
