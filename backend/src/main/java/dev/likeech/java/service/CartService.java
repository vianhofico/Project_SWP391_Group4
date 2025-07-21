package dev.likeech.java.service;


import dev.likeech.java.model.dto.CartDTO;

public interface CartService {

    CartDTO getCart(Long userId);

}
