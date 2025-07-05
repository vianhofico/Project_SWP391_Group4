package com.javaweb.dtos.response.admin;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.javaweb.entities.OrderItem;
import com.javaweb.entities.User;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@ToString(exclude = {"orderItems"})
public class OrderDTO {

    private Long orderId;
    private double amount;
    private String createdAt;
    private User user;
    private List<OrderItemDTO> orderItems = new ArrayList<>();
//    private List<OrderItem> orderItems = new ArrayList<>();
}
