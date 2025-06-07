package com.javaweb.services;

import com.javaweb.dtos.response.admin.NotificationDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {

    Page<NotificationDTO> getAllNotifications(Long userId, Pageable pageable);

}
