package com.javaweb.services.impl;

import com.javaweb.dtos.request.LoginRequest;
import com.javaweb.dtos.request.RegisterRequest;
import com.javaweb.dtos.response.LoginResponse;
import com.javaweb.entities.User;
import com.javaweb.exceptions.ResourceAlreadyExistsException;
import com.javaweb.exceptions.UnauthorizedException;
import com.javaweb.repositories.UserRepository;
import com.javaweb.security.jwt.JwtUtils;
import com.javaweb.services.AuthService;
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

@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authManager;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.email(),
                            loginRequest.password()
                    )
            );
            String token = jwtUtils.generateToken(loginRequest.email());
            return new LoginResponse(token);
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

}
