package com.javaweb.service;

import com.javaweb.dto.response.admin.NotificationDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {

    public Page<NotificationDTO> getAllNotifications(Long userId, Pageable pageable);

}
