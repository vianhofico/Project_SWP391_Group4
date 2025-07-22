package com.javaweb.java.services;


import com.javaweb.java.dtos.response.NotificationDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {

    Page<NotificationDTO> getAllNotifications(Long userId, Pageable pageable);

}
