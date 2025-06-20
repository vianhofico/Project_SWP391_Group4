package com.javaweb.services.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dtos.request.LoginRequest;
import com.javaweb.dtos.request.RegisterRequest;
import com.javaweb.dtos.request.ResetPasswordRequest;
import com.javaweb.dtos.response.LoginResponse;
import com.javaweb.entities.User;
import com.javaweb.exceptions.ResourceAlreadyExistsException;
import com.javaweb.exceptions.ResourceNotFoundException;
import com.javaweb.exceptions.UnauthorizedException;
import com.javaweb.repositories.UserRepository;
import com.javaweb.security.jwt.JwtUtils;
import com.javaweb.services.AuthService;
import com.javaweb.services.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authManager;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DTOConverter dtoConverter;
    private final MailService mailService;

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
                .role("USER")
                .createdAt(LocalDateTime.now())
                .reportCount(0)
                .isActive(true)
                .build();
        userRepository.save(user);
    }

    private String randomPassword() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 8);
    }

    @Override
    public void resetPassword(ResetPasswordRequest resetPasswordRequest) {
        String emailTo = resetPasswordRequest.to();
        User userTo = userRepository.findByEmail(emailTo).orElseThrow(
                () -> new ResourceNotFoundException("User with email: " + emailTo + " not found"));
        String subject = "Reset Password";
        String newPassword = randomPassword();
        String content = "Your new password is: " + newPassword;
        mailService.sendEmail(emailTo, subject, content);

        // gửi Mail xong phải cập nhập mật khẩu trong DB
        userTo.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(userTo);
    }

}
