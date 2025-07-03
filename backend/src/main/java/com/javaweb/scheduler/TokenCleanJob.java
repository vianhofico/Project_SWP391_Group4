package com.javaweb.scheduler;

import com.javaweb.repositories.TokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class TokenCleanJob {

    private final TokenRepository tokenRepository;

    @Transactional
    @Scheduled(cron = "0 0 2 * * *")
    public void cleanExpiredTokens() {
        int hour = LocalDateTime.now().getHour();
        log.info("Đang dọn các token hết hạn...", hour);
        tokenRepository.deleteAllExpired(LocalDateTime.now());
        log.info("Dọn xong token hết hạn.");
    }
}

