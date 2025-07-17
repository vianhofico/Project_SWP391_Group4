package com.javaweb.services.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dtos.request.OrderSearchRequest;
import com.javaweb.dtos.response.OrderDTO;
import com.javaweb.entities.Order;
import com.javaweb.repositories.OrderRepository;
import com.javaweb.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final DTOConverter dtoConverter;

    public Optional<Order> getById(long id) {
        return this.orderRepository.findById(id);
    }

    @Override
    public Page<OrderDTO> getAllOrders(OrderSearchRequest request, Pageable pageable) {
        String sortBy = request.sortBy();
        Sort sort = Sort.unsorted();

        if (sortBy != null) {
            String[] parts = sortBy.split("_");
            if (parts.length == 2) {
                String field = parts[0];
                String directionStr = parts[1];
                try {
                    Sort.Direction direction = Sort.Direction.fromString(directionStr);
                    sort = Sort.by(direction, field);
                } catch (IllegalArgumentException e) {
                    sort = Sort.by(Sort.Direction.DESC, "createdAt");
                }
            }
        }

        pageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                sort);

        Specification<Order> spec = Specification.where(null);

        if (request.startDate() != null && request.endDate() != null) {
            spec = spec
                    .and((root, query, cb) ->
                            cb.between(root.get("createdAt"),
                                    request.startDate().atStartOfDay(),
                                    request.endDate().atTime(23, 59, 59)));
        }

        if (request.userName() != null && !request.userName().isBlank()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(
                            cb.lower(root.get("user").get("fullName")),
                            "%" + request.userName() + "%"
                    )
            );
        }

        if (request.minPrice() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("totalPrice"), request.minPrice()));
        }

        if (request.maxPrice() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("totalPrice"), request.maxPrice()));
        }

        if (request.minPrice() != null && request.maxPrice() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.between(root.get("totalPrice"),
                            request.minPrice(),
                            request.maxPrice()));
        }

        Page<Order> orders = orderRepository.findAll(spec, pageable);
        return orders.map(dtoConverter::toOrderDTO);
    }

    @Override
    public OrderDTO getOrderById(Long id) {
        Optional<Order> order = orderRepository.findById(id);
        return dtoConverter.toOrderDTO(order.get());
    }

    @Override
    public Long getIdOfLastOrder() {
        List<Order> orders = this.orderRepository.findAll();
        if (orders.size() == 0) {
            return 1l * (-1);
        }
        long id = 0;
        for (Order o : orders) {
            id = Math.max(id, o.getOrderId());
        }
        return id - 1;
    }

    @Override
    public List<Long> findPurchasedCourseIdsByUser(Long userId) {
        return orderRepository.findPurchasedCourseIdsByUser(userId);
    }

}
