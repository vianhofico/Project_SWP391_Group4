package com.javaweb.repository;


import com.javaweb.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    public Page<Notification> findByUsersUserId(Long userId, Pageable pageable);

}
