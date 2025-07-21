package dev.likeech.java.service.impl;


import dev.likeech.java.entity.Notification;
import dev.likeech.java.mapper.DTOConverter;
import dev.likeech.java.model.dto.NotificationDTO;
import dev.likeech.java.repository.NotificationRepository;
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
