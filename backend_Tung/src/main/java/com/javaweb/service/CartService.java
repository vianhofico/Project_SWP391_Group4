package com.javaweb.services;

import com.javaweb.dtos.response.admin.CartDTO;

public interface CartService {

    CartDTO getCart(Long userId);

}
