package com.javaweb.java.services.impl;


import com.javaweb.java.entities.Notification;
import com.javaweb.java.converter.DTOConverter;
import com.javaweb.java.dtos.response.NotificationDTO;
import com.javaweb.java.repositories.NotificationRepository;
import com.javaweb.java.services.NotificationService;
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
        return null;
    }

}
