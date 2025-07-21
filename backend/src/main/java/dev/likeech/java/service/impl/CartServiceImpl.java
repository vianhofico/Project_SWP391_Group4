package dev.likeech.java.service.impl;


import dev.likeech.java.entity.Cart;
import dev.likeech.java.exp.ResourceNotFoundException;
import dev.likeech.java.mapper.DTOConverter;
import dev.likeech.java.model.dto.CartDTO;
import dev.likeech.java.repository.CartRepository;
import dev.likeech.java.service.CartService;
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
