package com.javaweb.java.services.impl;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.javaweb.java.entities.User;
import com.javaweb.java.converter.DTOConverter;
import com.javaweb.java.security.jwt.JwtUtils;
import com.javaweb.java.entities.VerificationToken;
import com.javaweb.java.exceptions.BusinessException;
import com.javaweb.java.exceptions.ResourceAlreadyExistsException;
import com.javaweb.java.exceptions.ResourceNotFoundException;
import com.javaweb.java.exceptions.UnauthorizedException;
import com.javaweb.java.dtos.events.EmailEvent;
import com.javaweb.java.dtos.events.VerifyEmailRequest;
import com.javaweb.java.dtos.request.LoginRequest;
import com.javaweb.java.dtos.request.RegisterRequest;
import com.javaweb.java.dtos.request.ResetPasswordRequest;
import com.javaweb.java.dtos.response.LoginResponse;
import com.javaweb.java.repositories.TokenRepository;
import com.javaweb.java.repositories.UserRepository;
import com.javaweb.java.services.AuthService;
import com.javaweb.java.services.MailService;
import com.javaweb.java.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.kafka.core.KafkaTemplate;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {

    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final DTOConverter dtoConverter;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final MailService mailService;
    private final UserService userService;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Transactional
    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.email(),
                            loginRequest.password()
                    )
            );
            String token = jwtUtils.generateToken(loginRequest.email());
            User thisUser = userRepository.findByEmail(loginRequest.email()).get();
            return new LoginResponse(token, dtoConverter.toUserDTO(thisUser));
        } catch (BadCredentialsException e) {
            throw new UnauthorizedException("Email or password is incorrect");
        } catch (DisabledException e) {
            throw new UnauthorizedException("User is disabled");
        }
    }

    @Transactional
    @Override
    public void register(RegisterRequest registerRequest) {
        String email = registerRequest.email();
        String password = registerRequest.password();
        String confirmPassword = registerRequest.confirmPassword();
        if (!password.equals(confirmPassword)) {
            throw new UnauthorizedException("Passwords do not match");
        }
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            throw new ResourceAlreadyExistsException("Email already exists");
        }

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .role("LEARNER")
                .createdAt(LocalDateTime.now())
                .reportCount(0)
                .isActive(true)
                .isVerified(false)
                .build();
        userRepository.save(user);

        String token = UUID.randomUUID().toString();
        VerificationToken vt = VerificationToken
                .builder()
                .token(token)
                .expiryTime(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();
        tokenRepository.save(vt);

//        EmailEvent event = new EmailEvent(
//                "VERIFY_EMAIL",
//                new VerifyEmailRequest(
//                        email,
//                        token
//                )
//        );
//        try {
//            kafkaTemplate.send("email", objectMapper.writeValueAsString(event));
//        } catch (JsonProcessingException e) {
//            log.error("Error while sending email event", e);
//        }
    }

    @Override
    public void sendEmailResetPassword(ResetPasswordRequest resetPasswordRequest) {
        String emailTo = resetPasswordRequest.to();
        String subject = "Reset Password";
        String newPassword = userService.saveNewPassword(resetPasswordRequest);
        String content = "Your new password is: " + newPassword;

        mailService.sendEmail(emailTo, subject, content);
    }

    @Override
    public void sendEmailVerification(VerifyEmailRequest verifyEmailRequest) {
        String emailTo = verifyEmailRequest.email();
        String subject = "Verify Email";
        String link = "http://localhost:8080/api/auth/verify?token=" + verifyEmailRequest.token();
        String content = "Click the link to verify your email: " + link;

        mailService.sendEmail(emailTo, subject, content);
    }

    @Transactional
    @Override
    public void verifyEmail(String token) {
        VerificationToken vt = tokenRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Token not found"));

        if (vt.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new UnauthorizedException("Token expired");
        }

        User user = vt.getUser();
        if (user.getIsVerified()) {
            throw new BusinessException("Account already verified");
        }

        user.setIsVerified(true);
        userRepository.save(user);

        tokenRepository.delete(vt);
    }

    @Override
    @Transactional
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Email not found"));

        if (user.getIsVerified()) {
            throw new BusinessException("Account already verified");
        }

        tokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();
        VerificationToken vt = VerificationToken.builder()
                .token(token)
                .user(user)
                .expiryTime(LocalDateTime.now().plusMinutes(15))
                .build();
        tokenRepository.save(vt);

        EmailEvent event = new EmailEvent("VERIFY_EMAIL", new VerifyEmailRequest(email, token));
        try {
            kafkaTemplate.send("email", objectMapper.writeValueAsString(event));
        } catch (JsonProcessingException e) {
            log.error("Error while sending email event", e);
        }
    }


}