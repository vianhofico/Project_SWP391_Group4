package com.javaweb.service;

import com.javaweb.dto.response.admin.CartDTO;

public interface CartService {

    public CartDTO getCart(Long userId);

}
