package com.javaweb.services.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.javaweb.converter.DTOConverter;
import com.javaweb.dtos.events.EmailEvent;
import com.javaweb.dtos.request.ChangePasswordRequest;
import com.javaweb.dtos.request.CreateAdminRequest;
import com.javaweb.dtos.request.ResetPasswordRequest;
import com.javaweb.dtos.request.SearchUserRequest;
import com.javaweb.dtos.response.UserDTO;
import com.javaweb.entities.User;
import com.javaweb.exceptions.BusinessException;
import com.javaweb.exceptions.ResourceAlreadyExistsException;
import com.javaweb.exceptions.ResourceNotFoundException;
import com.javaweb.repositories.UserRepository;
import com.javaweb.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final DTOConverter dtoConverter;
    private final PasswordEncoder passwordEncoder;

    private final String USER_NOTFOUND = "Cannot find user with id: ";
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    @Override
    public Page<UserDTO> getAllUsers(SearchUserRequest searchUserRequest, Pageable pageable) {
        String fullName = searchUserRequest.fullName();
        String sortField = searchUserRequest.sortField();
        String sortOrder = searchUserRequest.sortOrder();
        Boolean isActive = null;
        if (searchUserRequest.status() != null && !searchUserRequest.status().isBlank()) {
            isActive = (searchUserRequest.status().equalsIgnoreCase("ACTIVE"));
        }

        if (fullName != null && fullName.isBlank()) {//xử lý trường hợp mới tạo user chưa có fullName không hiện lên admin (khi đó tên user đó là null mà lại tìm kiếm theo %% nên không ra)
            fullName = null;
        }

        if (sortOrder == null || sortField == null || sortField.isEmpty() || sortOrder.isEmpty()) {
            sortOrder = "ASC";
            sortField = "userId";
        }
        Sort.Direction direction = Sort.Direction.fromString(sortOrder);
        pageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(direction, sortField)
        );
        Page<User> pageUsers = userRepository.findAllUsers(fullName, searchUserRequest.role().toUpperCase(), isActive, pageable);
        return pageUsers.map(dtoConverter::toUserDTO);
    }

    @Transactional
    @Override
    public void updateReportCount(Long userId) {
        Integer reportCount = userRepository.getReportCount(userId);
        if (reportCount != null) {
            User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException(USER_NOTFOUND + userId));
            if (user != null) {
                user.setReportCount(reportCount);
                if (user.getReportCount() >= 3) {
                    user.setIsActive(false);
                } else {
                    user.setIsActive(true);
                }
                userRepository.save(user);
            }
        }
    }

    @Transactional
    @Override
    public void removeUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException(USER_NOTFOUND + userId));
        if (user != null) {
            userRepository.delete(user);
        }
    }

    @Override
    public UserDTO getUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException(USER_NOTFOUND + userId));
        return dtoConverter.toUserDTO(user);
    }

    @Transactional
    @Override
    public void createAdmin(String email) {
        Optional<User> opUser = userRepository.findByEmail(email);
        if (opUser.isPresent()) {
            throw new ResourceAlreadyExistsException("Email: " + email + " already exist");
        }
        String randomPassword = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        String encodedPassword = passwordEncoder.encode(randomPassword);
        User user = User.builder()
                .email(email)
                .password(encodedPassword)
                .createdAt(LocalDateTime.now())
                .isVerified(true)
                .isActive(true)
                .role("ADMIN")
                .build();
        userRepository.save(user);

        EmailEvent event = new EmailEvent("ADD_ADMIN", new CreateAdminRequest(email, randomPassword));
        try {
            kafkaTemplate.send("email", objectMapper.writeValueAsString(event));
        } catch (JsonProcessingException e) {
        }
    }

    private String randomPassword() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 8);
    }

    @Transactional
    @Override
    public String saveNewPassword(ResetPasswordRequest resetPasswordRequest) {
        String emailTo = resetPasswordRequest.to();
        User userTo = userRepository.findByEmail(emailTo).orElseThrow(
                () -> new ResourceNotFoundException("User with email: " + emailTo + " not found"));

        String newPassword = randomPassword();
        userTo.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(userTo);
        return newPassword;
    }

    public Optional<User> getUserByEmail(String email) {
        return this.userRepository.findByEmail(email);
    }

    @Override
    public void changePassword(ChangePasswordRequest changePasswordRequest) {
        String email = changePasswordRequest.email();
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new ResourceNotFoundException("User with email: " + email + " not found")
        );
        String oldPassword = changePasswordRequest.oldPassword();
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new BusinessException("Wrong Old password");
        }
        String newPassword = changePasswordRequest.newPassword();
        String confirmPassword = changePasswordRequest.confirmPassword();
        if (!newPassword.equals(confirmPassword)) {
            throw new BusinessException("Wrong Confirm Password");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

}

