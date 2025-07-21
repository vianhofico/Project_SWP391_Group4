package dev.likeech.java.service.impl;


import dev.likeech.java.model.dto.NotificationDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {

    Page<NotificationDTO> getAllNotifications(Long userId, Pageable pageable);

}
