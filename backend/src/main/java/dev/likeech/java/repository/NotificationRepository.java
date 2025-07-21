package dev.likeech.java.repository;


import dev.likeech.java.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    Page<Notification> findByUsersUserId(Long userId, Pageable pageable);

}
