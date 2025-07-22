package com.javaweb.java.services;


import com.javaweb.java.dtos.response.CartDTO;

public interface CartService {

    CartDTO getCart(Long userId);

}
