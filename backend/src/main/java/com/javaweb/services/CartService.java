package com.javaweb.services;

import com.javaweb.dtos.response.CartDTO;

public interface CartService {

    CartDTO getCart(Long userId);

}
