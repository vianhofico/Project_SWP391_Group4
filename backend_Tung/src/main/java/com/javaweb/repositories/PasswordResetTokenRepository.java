package com.javaweb.repositories;

import com.javaweb.entities.PasswordResetToken;
import com.javaweb.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    PasswordResetToken findByToken(String token);
    Optional<PasswordResetToken> findByUser(User user);

}

