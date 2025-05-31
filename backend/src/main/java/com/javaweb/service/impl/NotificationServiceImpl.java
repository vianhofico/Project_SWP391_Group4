package com.javaweb.service.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dto.NotificationDTO;
import com.javaweb.entity.Notification;
import com.javaweb.repository.NotificationRepository;
import com.javaweb.service.NotificationService;
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
