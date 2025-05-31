package com.javaweb.service;

import com.javaweb.dto.CartDTO;

public interface CartService {

    public CartDTO getCart(Long userId);

}
