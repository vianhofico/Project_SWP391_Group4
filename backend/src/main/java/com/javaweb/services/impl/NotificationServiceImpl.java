package com.javaweb.services.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dtos.response.admin.NotificationDTO;
import com.javaweb.entities.Notification;
import com.javaweb.repositories.NotificationRepository;
import com.javaweb.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final DTOConverter dtoConverter;

    public Page<NotificationDTO> getAllNotifications(Long userId, Pageable pageable) {
        Page<Notification> pageNotifications = notificationRepository.findByUsersUserId(userId, pageable);
        return pageNotifications.map(dtoConverter::toNotificationDTO);
    }

}
